/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/symbol.hpp>
#include <eosiolib/public_key.hpp>
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

constexpr auto purchase_symbol = symbol("EOS", 4);


CONTRACT example : public eosio::contract {
  using contract::contract;
  public:

    example(name self, name code,  datastream<const char*> ds): eosio::contract(self, code, ds), files(_self, _self.value){}
      
    TABLE fileinfo {
      uint64_t            id;
      std::string         uuid;
      name                owner;
      std::string         name;
      std::string         description;
      std::string         url;
      asset               price;
      uint32_t                created_at;
      bool                deleted = false;
      
      uint64_t primary_key()const { return id; }
      uint128_t byuuid() const { return hex_strtoulll(uuid.c_str(), uuid.length()); }
    };
    typedef multi_index<"files"_n, fileinfo,
      indexed_by< "byuuid"_n, const_mem_fun<fileinfo, uint128_t,  &fileinfo::byuuid> >
    > files_table;
    files_table files;

    // @abi table balances i64
    TABLE balance {
        asset funds;
        
        uint64_t primary_key() const { return funds.symbol.code().raw(); }
    };
    typedef multi_index<"balances"_n, balance> balances_table;
    
    // @abi table perms i64
    TABLE perm {
      uint64_t id;
      
      uint64_t primary_key()const { return id; }
    };
    typedef multi_index<"perms"_n, perm> perms_table;
  
    //@abi action
    ACTION upload(const name owner, const std::string uuid, const std::string name, const std::string description, const std::string url, const asset price);
    
    ACTION admdelete(const std::string uuid);
    //@abi action
    ACTION prepare(const name user);
    ACTION transfer(const name from, const name to, const asset quantity, const std::string memo);
    //@abi action
    ACTION purchase(const name buyer, const std::string uuid);
    //@abi action
    ACTION accessgrant(const name user, const name contract, const std::string uuid, const eosio::public_key public_key);
    
  private:

    const fileinfo get_file_byuuid(const std::string uuid) {
      const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());
      auto idx = files.template get_index<"byuuid"_n>();
      return idx.get(uuid_int, "File not found ");
    }
    
    
    void add_balance(const name user, const asset value) {
      balances_table balances(_self, user.value);
      auto user_it = balances.find(purchase_symbol.code().raw());
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
    
    void sub_balance(const name user, const asset value) {
      balances_table balances(_self, user.value);
      const auto& user_balance = balances.get(value.symbol.code().raw(), "User has no balance");
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






