#include "lib/memory.h"

void fb_init(fifo_circular_buffer *fb, uint8_t* buffer, uint32_t capacity)
{
    fb->buffer = buffer;
    fb->size = capacity;
    fb->head = 0;
    fb->tail = 0;
}

void fb_push(fifo_circular_buffer *fb, uint8_t *item, uint32_t len)
{
	if((fb->head < fb->tail && len >= fb->tail - fb->head) || (fb->head >= fb->tail && len >= fb->size - fb->head + fb->tail))
	//if((fb->head + len + 1) % fb->size >= fb->tail)
		return;//overflow_error

	if(fb->head == fb->size - 1) {
		*(fb->buffer) = len;
		fb->head = 0;
	}
	else {
		*(fb->buffer+fb->head) = len;
		fb->head++;
	}

	if(fb->head + len >= fb->size) {
		memcpy((void*)(fb->buffer+fb->head), (void*)item, (uint8_t)(fb->size - fb->head));
		len -= fb->size - fb->head;
		fb->head = 0;
	}
	memcpy(fb->buffer+fb->head, item, len);
	fb->head += len;
}

void fb_pop(fifo_circular_buffer *fb, uint8_t *item, uint32_t *len)
{
    if(fb->tail == fb->head)
    	return; // Null pointer exception
    *len = fb->buffer[fb->tail];
    if(*len + fb->tail + 1 >= fb->size) {
    	memcpy(item, fb->buffer+fb->tail+1, fb->size - fb->tail-1);
    	memcpy(item + fb->size - fb->tail-1, fb->buffer, *len - (fb->size - fb->tail-1));
    	fb->tail = *len - (fb->size - fb->tail-1);
    }
    else {
    	memcpy(item, fb->buffer+fb->tail+1, *len);
    	fb->tail += *len + 1;
    }
}


int fb_has_next(fifo_circular_buffer *fb) {
	return fb->tail != fb->head;
}
