pragma solidity >=0.4.22 <0.7.0;

contract H_Coin{
    uint256 totalSupply_;
    string public name;
    string public symbol;
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    event Approval(address indexed tokenOwner, address indexed spender,uint tokens);
    event Transfer(address indexed from, address indexed to,uint tokens);
    constructor()public{
        name = "Heart Coin";
        symbol = "H";
        totalSupply_ = 1000;
        balances[msg.sender] = totalSupply_;
    }
    //check total supply /
    function totalSupply() public view returns (uint256){
        return totalSupply_;
    }
    //balanceOf address owner /
    function balanceOf(address tokenOwner) public view returns (uint256){
        return balances[tokenOwner];
    }
    //transfer to other address /
    function transfer(address receiver,uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender], "balances of sender not enough");
        require(msg.sender != receiver, "Sender and reciever cannot be the same!");
        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        totalSupply_ = balances[msg.sender] + balances[receiver];
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }
    //approve to other address อนุมัติ
    function approve(address delegate,uint numTokens) public returns (bool) {
        require(msg.sender != delegate, "Sender and delegate cannot be the same!");
        require(numTokens > 0, "Value cannot less than one!");
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }
    //allowance
    function allowance(address owner,address delegate) public view returns (uint256) {
        require(owner != delegate, "Sender and delegate cannot be the same!");
        return allowed[owner][delegate];
    }
    //transferFrom ตัวกลาง
     function transferFrom(address from, address to, uint tokens) public returns (bool success) {
        require(tokens > 0, "Value cannot less than one!");
        balances[from] = balances[from]-tokens;
        allowed[from][msg.sender] = allowed[from][msg.sender]-tokens;
        balances[to] = balances[to]+tokens;
        totalSupply_ = balances[from]+balances[to];
        emit Transfer(from, to, tokens);
        return true;
    }
}
