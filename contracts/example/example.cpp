#include "example.hpp"


void example::upload(const account_name owner, const std::string uuid, const std::string name, const std::string description, const std::string url, const asset price) {
  require_auth(owner);
  
  const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());

  auto idx = files.template get_index<N(by_uuid)>();
  const auto itr = idx.find(uuid_int);
  if(itr != idx.end()) {
    eosio_assert(itr->owner == owner, "Different owner");
    idx.modify(itr, owner, [&](fileinfo& file) {
      file.name = name;
      file.description = description;
      file.price = price;
      file.url = url;
    });
  } else {
    files.emplace(owner, [&](fileinfo& file) {
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
    
//@abi action
void example::prepare(const account_name user) {
  require_auth(user);
  balances_table balances(_self, user);      
  auto it = balances.find(purchase_symbol);
  if(it == balances.end()) {
    balances.emplace(user, [&](auto& bal){
        bal.funds = asset(0, purchase_symbol);
    });
  }
}
    
void example::transfer(const currency::transfer &transfer) {
  if(transfer.from == _self || transfer.to != _self) {
    /* only handle incoming transfers to this contract */
    return;
  }
  eosio_assert(transfer.quantity.symbol == purchase_symbol, 
    "Only EOS allowed");
  eosio_assert(transfer.quantity.is_valid(), "Are you trying to corrupt me?");
  eosio_assert(transfer.quantity.amount > 0, "When pigs fly");
  
  balances_table balances(_self, transfer.from);
  auto it = balances.find(transfer.quantity.symbol);
  
  eosio_assert(it != balances.end(), "Balance table entry does not exist, call prepare first");
  
  balances.modify(it, transfer.from, [&](auto& bal){
      bal.funds += transfer.quantity;
  });
}
    
//@abi action
void example::purchase(const account_name buyer, const std::string uuid) {
  require_auth(buyer);
  
  
  const auto& file = get_file_by_uuid(uuid);
  
  balances_table buyer_balances(_self, buyer);
  const auto& buyer_balance = buyer_balances.get(purchase_symbol, "Buyer does not have a balance");
  
  eosio_assert(buyer_balance.funds >= file.price, "Buyer does not have enough money");
  
  
  // 1. reduce buyer balance by price
  sub_balance(buyer, file.price);
  
  // 2. increase seller balance by price
  add_balance(file.owner, file.price);
  
  // 3. add entry to perm table for buyer
  perms_table perms(_self, buyer);
  perms.emplace(buyer, [&](auto& perm) {
    perm.id = file.id;
  });
  
}
    
//@abi action
void example::accessgrant(const account_name user, const account_name contract, const std::string uuid) {
  require_auth(user);
  
  const auto& file = get_file_by_uuid(uuid);
  perms_table perms(_self, user);
  perms.get(file.id, "Access denied");
}  


// EOSIO_ABI( example, (upload) )

extern "C" {
  void apply(uint64_t self, uint64_t code, uint64_t action) {
    example thiscontract(self);
    if(code==self && action==N(upload)) {
      execute_action( &thiscontract, &example::upload );
    } 
    else if(code==self && action==N(prepare)) {
      execute_action( &thiscontract, &example::prepare );
    }
    else if(code==self && action==N(purchase)) {
      execute_action( &thiscontract, &example::purchase );
    }
    else if(code==N(priveosrules) && action==N(accessgrant)) {
      execute_action( &thiscontract, &example::accessgrant );
    }
    else if(code==N(eosio.token) && action==N(transfer)) {
      thiscontract.transfer(unpack_action_data<currency::transfer>());
    }
  }
};