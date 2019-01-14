#include "example.hpp"


void example::upload(const name owner, const std::string uuid, const std::string name, const std::string description, const std::string url, const asset price) {
  require_auth(owner);
  eosio_assert(price.symbol == purchase_symbol, "Symbol mismatch. Only 4,EOS assets allowed");

  const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());

  auto idx = files.template get_index<"byuuid"_n>();
  const auto itr = idx.find(uuid_int);
  if(itr != idx.end()) {
    eosio_assert(itr->owner == owner, "Different owner");
    idx.modify(itr, owner, [&](auto& file) {
      file.name = name;
      file.description = description;
      file.price = price;
      file.url = url;
    });
  } else {
    files.emplace(owner, [&](auto& file) {
      file.id = files.available_primary_key();
      file.uuid = uuid;
      file.owner = owner;
      file.name = name;
      file.description = description;
      file.price = price;
      file.url = url;
      file.created_at = now();
    });
  }
  
  /* Make sure owner of the file has an entry in the currency balance table */
  example::prepare(owner);
}

void example::admdelete(const std::string uuid) {
  require_auth(_self);
  const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());

  auto idx = files.template get_index<"byuuid"_n>();
  const auto itr = idx.find(uuid_int);
  idx.erase(itr);
}

void example::admdelperm(const name user) {
  require_auth(_self);
  std::vector<perm> l;
  
  perms_table perms(_self, user.value);
  for(const auto& x: perms) {
    l.push_back(x);
  }
  for(const auto x: l) {
    perms.erase(perms.find(x.primary_key()));
  }
}
    
//@abi action
void example::prepare(const name user) {
  require_auth(user);
  balances_table balances(_self, user.value);      
  auto it = balances.find(purchase_symbol.code().raw());
  if(it == balances.end()) {
    balances.emplace(user, [&](auto& bal){
        bal.funds = asset{0, purchase_symbol};
    });
  }
}
    
void example::transfer(const name from, const name to, const asset quantity, const std::string memo) {
  if(from == _self || to != _self) {
    /* only handle incoming transfers to this contract */
    return;
  }
  eosio_assert(quantity.symbol == purchase_symbol, 
    "Only EOS allowed");
  eosio_assert(quantity.is_valid(), "Are you trying to corrupt me?");
  eosio_assert(quantity.amount > 0, "When pigs fly");
  
  balances_table balances(_self, from.value);
  auto it = balances.find(quantity.symbol.code().raw());
  
  eosio_assert(it != balances.end(), "Balance table entry does not exist, call prepare first");
  
  balances.modify(it, from, [&](auto& bal){
      bal.funds += quantity;
  });
}
    
//@abi action
void example::purchase(const name buyer, const std::string uuid) {
  require_auth(buyer);
  
  
  const auto& file = get_file_byuuid(uuid);

  if(file.price.amount > 0) {  
    balances_table buyer_balances(_self, buyer.value);
    const auto& buyer_balance = buyer_balances.get(purchase_symbol.code().raw(), "Buyer does not have a balance");
    
    eosio_assert(buyer_balance.funds >= file.price, "Buyer does not have enough money");
    
    // 1. reduce buyer balance by price
    sub_balance(buyer, file.price);
    
    // 2. increase seller balance by price
    add_balance(file.owner, file.price);
  }
  
  // 3. add entry to perm table for buyer
  perms_table perms(_self, buyer.value);
  perms.emplace(buyer, [&](auto& perm) {
    perm.id = file.id;
  });
}
    
//@abi action
void example::accessgrant(const name user, const name contract, const std::string uuid, const eosio::public_key public_key) {
  require_auth(user);
  
  const auto& file = get_file_byuuid(uuid);
  perms_table perms(_self, user.value);
  perms.get(file.id, "Access denied");
} 

extern "C" {
  [[noreturn]] void apply(uint64_t receiver, uint64_t code, uint64_t action) {
    if (action == "transfer"_n.value && code == "eosio.token"_n.value) {
      execute_action(eosio::name(receiver), eosio::name(code), &example::transfer);
    }
    
    if (action == "accessgrant"_n.value && code == "priveosrules"_n.value) {
      execute_action(eosio::name(receiver), eosio::name(code), &example::accessgrant);
    }

    if (code == receiver) {
      switch (action) { 
        EOSIO_DISPATCH_HELPER( example, (upload)(prepare)(purchase)(admdelete)(admdelperm) ) 
      }    
    }

    eosio_exit(0);
  }
}