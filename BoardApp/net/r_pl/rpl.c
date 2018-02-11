#include "net/r_pl/rpl.h"
#include "net/mac/mac.h"
#include "system/timer.h"
#include "lib/led.h"
#include "lib/memory.h"

#define RPL_BUFFER_LENGTH 512

fifo_circular_buffer fifo_buffer;
uint8_t buffer_data[RPL_BUFFER_LENGTH];

#define MAX_ROUTES 32

uint32_t routes[MAX_ROUTES];

TimerEvent_t rpl_timer;
TimerEvent_t rpl_DATA_expire;

uint8_t _is_root;
uint8_t HOP;
int dataornot = 0;
int rpl_routine = 0;

void rpl_process();
int rpl_callback(char *msg, uint8_t len);

void rpl_init(int is_root, uint32_t addr) {
		routes[0] = 0;
		_is_root = is_root;
		HOP = (!_is_root)*100;

		fb_init(&fifo_buffer, buffer_data, RPL_BUFFER_LENGTH);

		mac_init(addr);

		set_readcallback(&rpl_callback);

	    TimerInit( &rpl_timer, &rpl_process );

	    TimerSetValue( &rpl_timer, 8000 );

	    TimerStart( &rpl_timer );
}

void rpl_process() {
	//blink(1, 100);
	rpl_routine = 1;
}

void rpl_forward(char *msg, uint32_t len) {
	if(routes[0] != 0)
		mac_forward((uint8_t*)msg, len, routes[0]);
}

int rpl_callback(char *msg, uint8_t len) {led_switch(3);
	fb_push(&fifo_buffer, (uint8_t*)msg, len);
	return 1;
}

char bmsg[125];
char *msg;
void rpl_check() {
	uint32_t len;
	if(fb_has_next(&fifo_buffer)) {
		uint32_t len;
		fb_pop(&fifo_buffer, (uint8_t*)msg, &len);
		len -= mac_size();
		msg = (char *)bmsg + mac_size();
		switch(msg[0]) {
		// DATA
		case 'D':
			rpl_forward(msg+1, len-1);
			//return 1;
		break;
		// ROUTING
		case 'R':blink(1, 100);
			//if(*(uint8_t*)(msg+1) < HOP + 1) {
				HOP = *(uint8_t*)(msg+1) + 1;
				routes[0] = mac_get_ip((uint8_t *)(msg));
			//}
			//return 1;
		break;
		// ERROR
		default:
			//return 0;
		break;
		}
	}
	else if(rpl_routine){blink(2, 100);
		if(0 && dataornot) {
			len = mac_size();
			uint8_t *packet = ((uint8_t *) bmsg) + len;
			*packet = 'D';
			packet++;
			*packet = 'P';
			len  += 2;
			rpl_forward(bmsg, len);
			dataornot = 0;
		}
		else {
			len = mac_size();
			uint8_t *packet = ((uint8_t *) bmsg) + len;
			*packet = 'R';
			packet++;
			*(uint8_t*)packet = HOP;
			len += 2;
			mac_broadcast((uint8_t *)bmsg, len);
			dataornot = 1;
		}
		rpl_routine = 0;
		while(is_sending());
		TimerStart( &rpl_timer );
	}
}
