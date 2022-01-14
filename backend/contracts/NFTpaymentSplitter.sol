// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract NFTpaymentSplitter is Context {
      using SafeERC20 for IERC20;

       IERC20 private BUSD;

    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event ERC20PaymentReleased(IERC20 indexed token, address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    uint256 private _totalShares;
    uint256 private _totalReleased;

    mapping(address => uint256) private _shares;
    mapping(address => uint256) private _released;
    address[] private _payees;

    mapping(IERC20 => uint256) private _erc20TotalReleased;
    mapping(IERC20 => mapping(address => uint256)) private _erc20Released;

    address Marketing = address(0x6424f2C32134473Bb362F4F6b21d4481eadCf4DC) ;
    address Development = address(0xCFcfcb9553F5A49ac983C50e24C6443f325Dd7d1) ;
    address Pool = address(0xd0cFcBB99a9CC54c13ceCA88e710351248f68654) ;
    address Contingencies =address(0xeefE7bde6E77e448441a998b63452c8057FD7548) ;
    address PreDevelopment = address(0x0259FC8c828255fA7b90D928b3939f6944475ba7) ;

    uint256[] shares_ = [2375,2375,2375,2375,500];
    address[] payees = [Marketing,Development,Pool,Contingencies,PreDevelopment];

 constructor() payable {
        require(payees.length == shares_.length, "PaymentSplitter: payees and shares length mismatch");
        require(payees.length > 0, "PaymentSplitter: no payees");
        BUSD = IERC20(0xca9Eb9DDC1B511d5B67d833D1d36Ee85503DA93E);
        for (uint256 i = 0; i < payees.length; i++) {
            _addPayee(payees[i], shares_[i]);
        }
    }
 receive() external payable virtual {
        emit PaymentReceived(_msgSender(), msg.value);
    }

    
    function totalShares() public view returns (uint256) {
        return _totalShares;
    }

   
    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }

    
    function totalReleased(IERC20 token) public view returns (uint256) {
        return _erc20TotalReleased[token];
    }

    
    function shares(address account) public view returns (uint256) {
        return _shares[account];
    }

    function released(address account) public view returns (uint256) {
        return _released[account];
    }

    
    function released(IERC20 token, address account) public view returns (uint256) {
        return _erc20Released[token][account];
    }

   
    function payee(uint256 index) public view returns (address) {
        return _payees[index];
    }

    function release(address payable account) public virtual {
        require(_shares[account] > 0, "PaymentSplitter: account has no shares");

        uint256 totalReceived = address(this).balance + totalReleased();
        uint256 payment = _pendingPayment(account, totalReceived, released(account));

        require(payment != 0, "PaymentSplitter: account is not due payment");

        _released[account] += payment;
        _totalReleased += payment;

        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }

    function releaseBUSD( address account) public virtual {
        require(_shares[account] > 0, "PaymentSplitter: account has no shares");

        uint256 totalReceived = BUSD.balanceOf(address(this)) + totalReleased(BUSD);
        uint256 payment = _pendingPayment(account, totalReceived, released(BUSD, account));

        require(payment != 0, "PaymentSplitter: account is not due payment");

        _erc20Released[BUSD][account] += payment;
        _erc20TotalReleased[BUSD] += payment;

        SafeERC20.safeTransfer(BUSD, account, payment);
        emit ERC20PaymentReleased(BUSD, account, payment);
    }

    function pendingBUSD(address account) public view returns(uint256){
         require(_shares[account] > 0, "PaymentSplitter: account has no shares");

        uint256 totalReceived = BUSD.balanceOf(address(this)) + totalReleased(BUSD);
        uint256 payment = _pendingPayment(account, totalReceived, released(BUSD, account));
        return payment;
    }

     function _pendingPayment(
        address account,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return (totalReceived * _shares[account]) / _totalShares - alreadyReleased;
    }

      function _addPayee(address account, uint256 shares) private {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        require(shares > 0, "PaymentSplitter: shares are 0");
        require(_shares[account] == 0, "PaymentSplitter: account already has shares");

        _payees.push(account);
        _shares[account] = shares;
        _totalShares = _totalShares + shares;
        emit PayeeAdded(account, shares);
    }

}