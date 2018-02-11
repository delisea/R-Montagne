#ifndef MAC
#define MAC

/*void send();
int has_packet();
char* pop(int* len);*/
#include "stdint.h"

void set_readcallback(int callback(char *msg, uint8_t len));
//char* init_packet(char* buffer, uint32_t dest);
uint32_t size_packet();
void send(uint8_t *buffer, uint32_t len);
void mac_forward(uint8_t *packet, uint32_t len, uint32_t dest);
void mac_broadcast(uint8_t *packet, uint32_t len);
uint32_t mac_size();
uint32_t mac_get_ip(uint8_t *packet);
void rpl_init(int is_root, uint32_t addr);
void mac_init(uint32_t addr);
uint8_t is_sending();
#endif
