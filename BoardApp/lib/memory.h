#ifndef MEMORY
#define MEMORY
#include <stdint.h>
#include <string.h>

//WARNING: pas de data de plus de 254B

typedef struct struct_fifo_circular_buffer
{
    uint8_t *buffer;     // data buffer
    uint32_t size;  // size of the buffer
    uint32_t head;       // pointer to head
    uint32_t tail;       // pointer to tail
} fifo_circular_buffer;

void fb_init(fifo_circular_buffer *fb, uint8_t* buffer, uint32_t capacity);

void fb_push(fifo_circular_buffer *fb, uint8_t *item, uint32_t len);

void fb_pop(fifo_circular_buffer *fb, uint8_t *item, uint32_t *len);

int fb_has_next(fifo_circular_buffer *fb);
#endif
