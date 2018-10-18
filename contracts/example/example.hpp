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

using namespace eosio;

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

constexpr auto purchase_symbol = string_to_symbol(4, "EOS");


class example : public eosio::contract {
  using contract::contract;
  public:

  example(account_name self): eosio::contract(self), files(self, self){}
  
    //@abi action
    void upload(const account_name owner, const std::string uuid, const std::string name, const std::string description, const std::string url, const asset price);
    //@abi action
    void prepare(const account_name user);
    void transfer(const currency::transfer &transfer);
    //@abi action
    void purchase(const account_name buyer, const std::string uuid);
    //@abi action
    void accessgrant(const account_name user, const account_name contract, const std::string uuid, const eosio::public_key public_key);
    
    
  private:
    // @abi table files i64
    struct fileinfo {
      uint64_t            id;
      std::string         uuid;
      account_name        owner;
      std::string         name;
      std::string         description;
      std::string         url;
      asset               price;
      time                created_at;
      bool                deleted = false;
      
      uint64_t primary_key()const { return id; }
      uint128_t by_uuid() const { return hex_strtoulll(uuid.c_str(), uuid.length()); }
      
      EOSLIB_SERIALIZE(fileinfo, (id)(uuid)(owner)(name)(description)(url)(price)(created_at)(deleted))
    };
    typedef multi_index<N(files), fileinfo,
      indexed_by< N(by_uuid), const_mem_fun<fileinfo, uint128_t,  &fileinfo::by_uuid> >
    > files_table;
    files_table files;

    // @abi table balances i64
    struct balance {
        asset funds;
        uint64_t primary_key() const { return funds.symbol; }
        
        EOSLIB_SERIALIZE(balance, (funds))
    };
    typedef multi_index<N(balances), balance> balances_table;
    
    // @abi table perms i64
    struct perm {
      uint64_t id;
      
      uint64_t primary_key()const { return id; }
    };
    typedef multi_index<N(perms), perm> perms_table;
    
    const fileinfo get_file_by_uuid(const std::string uuid) {
      const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());
      auto idx = files.template get_index<N(by_uuid)>();
      return idx.get(uuid_int, "File not found ");
    }
    
    
    void add_balance(account_name user, asset value) {
      balances_table balances(_self, user);
      auto user_it = balances.find(purchase_symbol);
      if(user_it != balances.end()) {
        balances.modify(user_it, user, [&](auto& bal){
            bal.funds += value;
        });
      } else {
        balances.emplace(user, [&](auto& bal){
            bal.funds = value;
        });
      }
    }
    
    void sub_balance(account_name user, asset value) {
      balances_table balances(_self, user);
      const auto& user_balance = balances.get(value.symbol, "User has no balance");
      eosio_assert(user_balance.funds >= value, "Overdrawn balance");
      
      if(user_balance.funds == value) {
        balances.erase(user_balance);
      } else {
        balances.modify(user_balance, user, [&](auto& bal){
            bal.funds -= value;
        });
      }
    }

};






