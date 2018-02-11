#include "net/r_pl/rpl.h"

void check_event() {
	rpl_check();
}
#include "board.h"
int main( void )
{
	rpl_init(1, 42);
	/*while(1) {
		DelayMs( 1000 );
        GpioWrite( &Led1, GpioRead( &Led1 ) ^ 1 );
		mac_broadcast("coucoucoucoucoucou", 11);
	}*/

	while(1)
		rpl_check();
}
