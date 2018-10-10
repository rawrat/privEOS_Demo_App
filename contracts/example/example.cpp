#include "example.hpp"

using namespace eosio;

class example : public eosio::contract {
  public:
    using contract::contract;
    example(account_name self): eosio::contract(self), files(_self, _self){}

    //@abi action
    void upload(const account_name owner, const std::string uuid, const std::string name, const std::string description, const std::string url, const asset price) {
      require_auth(owner);
      
      const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());
      
      auto idx = files.template get_index<N(by_uuid)>();
      const auto itr = idx.find(uuid_int);
      if(itr != idx.end()) {
        const auto& file = idx.get(uuid_int);
        eosio_assert(file.owner == owner, "Different owner");
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
    }
    
    //@abi action
    void prepare(const account_name user) {
      require_auth(user);
      balances_table balances(_self, user);      
      auto it = balances.find(string_to_symbol(4, "EOS"));
      if(it == balances.end()) {
        balances.emplace(user, [&](auto& bal){
            bal.funds = asset(0, string_to_symbol(4, "EOS"));
        });
      }
    }
    
    void transfer(const currency::transfer &transfer) {
      eosio_assert(transfer.quantity.symbol == string_to_symbol(4, "EOS"), 
        "This is not the contract you're looking for.");
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
    void reqaccess(const account_name user, std::string uuid) {
      require_auth(user);
      
      const uint128_t uuid_int = hex_strtoulll(uuid.c_str(), uuid.length());
      
      auto idx = files.template get_index<N(by_uuid)>();
      const auto& file = idx.get(uuid_int, "File not found ");
      
      balances_table balances(_self, user);
      const auto& balance = balances.get(string_to_symbol(4, "EOS"));
      eosio_assert(balance.funds.amount >= file.price.amount, "User does not have enough money");
      
      // action(
      //       permission_level{ _self, N(active) },
      //       N(eosio),
      //       N(newaccount),
      //       new_account
      // ).send();
      
    }
    
      
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
      uint64_t      file_id;
    };
    typedef multi_index<N(perms), perm> perms_table;
    

};


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
    else if(code==self && action==N(reqaccess)) {
      execute_action( &thiscontract, &example::reqaccess );
    }
    else if(code==N(eosio.token) && action==N(transfer)) {
      thiscontract.transfer(unpack_action_data<currency::transfer>());
    }
  }
};