/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/currency.hpp>

#include <stdio.h>
#include <string.h>
#include <inttypes.h>
#include <ctype.h>
#include <errno.h>

uint8_t ascii2hex( char s )
{
    uint8_t r = 0xf;

    if( (s >= 48) && (s <= 57) )
        r = s - 48;
    else if( (s >= 65) && ( s <= 70) )
        r = s - 55;
    else if( (s >= 97) && (s <= 102) )
        r = s - 87;
    return r;
}

uint128_t hex_strtoulll(const char *nptr, int len)
{
    int i;
    uint128_t r = 0, p;

    for(i = len; i >= 0; i--)
    {
        p = (uint128_t)ascii2hex(*(nptr + i));
        p = p << ((len - i) << 2);
        r |= p;
    }
    return r;
}
