#include "lib/led.h"
#include "board.h"
#include "system/timer.h"

TimerEvent_t blink_timer;
uint8_t flags = 0;

void stop_blink() {
	switch(flags/2) {
	case 1:
		GpioWrite( &Led1, 1);
	break;
	case 2:
		GpioWrite( &Led2, 1);
	break;
	case 3:
		GpioWrite( &Led3, 1);
	}
	flags = flags % 2;
}

void blink(int led, int duration) {
	if(led < 1 || led > 3)
		return;
	if(!(flags%2)) {
		flags++;
		TimerInit( &blink_timer, &stop_blink );
	}
	if(flags/2 != 0) {
		stop_blink();
	}
	switch(led) {
	case 1:
		GpioWrite( &Led1, 0);
	break;
	case 2:
		GpioWrite( &Led2, 0);
	break;
	case 3:
		GpioWrite( &Led3, 0);
	}
	flags += led * 2;

    TimerSetValue( &blink_timer, duration );
    TimerStart( &blink_timer );
}

void led_switch(int led) {
	switch(led) {
	case 1:
		GpioWrite( &Led1, GpioRead( &Led1 ) ^ 1 );
	break;
	case 2:
		GpioWrite( &Led2, GpioRead( &Led2 ) ^ 1 );
	break;
	case 3:
		GpioWrite( &Led3, GpioRead( &Led3 ) ^ 1 );
	}
}
