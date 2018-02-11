#include "net/mac/mac.h"
#include "net/radio_r.h"
#include "memory.h"

static RadioEvents_t RadioEvents;
uint32_t link_local;
uint8_t sending = 0;

int (*readcallback)(char *msg, uint8_t len);
void set_readcallback(int callback(char *msg, uint8_t len)) {
	readcallback = callback;
}

uint8_t is_sending() {
	return sending;
}

/*char* init_packet(uint8_t *packet, unint32_t len) {
	uint32_t *p = (uint32_t*)(packet+1);
	*p = dest;
	return (char*)(p++);
}*/

uint32_t mac_size() {
	return 8;
}

void mac_forward(uint8_t *packet, uint32_t len, uint32_t dest) {
	uint32_t *p = (uint32_t*)(packet);
	*p = dest;
	p++;
	*p = link_local;
	send( packet, len );
}

void mac_broadcast(uint8_t *packet, uint32_t len) {
	uint32_t *p = (uint32_t*)(packet);
	*p = 0;
	p++;
	*p = link_local;
	send( packet, len );
}

uint32_t mac_get_ip(uint8_t *packet) {
	return *(-1+(uint32_t*)packet);
}

void send(uint8_t *buffer, uint32_t len) {
	sending = 1;
	Radio.Send( buffer, len );
}

void otd( void )
{
	sending = 0;
	Radio.Rx( 0 );
}

void ord( uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr ) {
	Radio.Sleep( );
	//readcallback((char *)(((uint32_t*)payload)+1), size-8);
	readcallback(payload, size);
	Radio.Rx( 0 );
	return;
    //RssiValue = rssi; // puissance
    //SnrValue = snr; // rapport signal/bruit
	uint32_t dest = *(uint32_t*)payload;
	payload += 4;
    if(dest/32 == link_local/32)
    if(dest == link_local || dest == 0) {
    	//Radio.Sleep( );
    	if(readcallback((char *)(((uint32_t*)payload)+1), size-2)) {

    		//TODO: ack();
    	}
    	Radio.Rx( 0 );
    }
}

void ott( void )
{
	sending = 0;
	Radio.Rx( 0 );
}

void ort( void )
{
	Radio.Rx( 0 );
}

void rxe( void )
{
}

void rpl_process();

/**
 * Main application entry point.
 */

void mac_init(uint32_t addr) {
	link_local = addr;

	init_radio(&RadioEvents);
	// Radio initialization
	RadioEvents.TxDone = otd;
	RadioEvents.RxDone = ord;
	RadioEvents.TxTimeout = ott;
	RadioEvents.RxTimeout = ort;
	RadioEvents.RxError = rxe;
	Radio.Rx( 0 );
}
