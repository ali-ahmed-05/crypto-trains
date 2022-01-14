import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { connectWallet } from "../utils/connectWallet";
import logo from "../assets/img/logo.png";
import metamask from "../assets/img/metamask.png";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";

import { ethers, BigNumber } from "ethers";
import { nft_addr, nftPreSale_addr } from "../contract/addresses";
import NFT from "../contract/NFT.json";
import NFTCrowdsale from "../contract/NFTCrowdsale.json";
import Web3Modal from "web3modal";


function Header(props) {
  const {
    connector,
    library,
    account,
    chainId,
    activate,
    deactivate,
    active,
    errorWeb3Modal,
  } = useWeb3React();

  const [currentTime,setCurrentTime] = useState(0);
  const [timeState,setTimeState] = useState(0)
  const [d,setD] = useState(0)
  const [h,setH] = useState(0)
  const [m,setM] = useState(0)
  const [s,setS] = useState(0)
  const [shortAddress,setShortAddress] = useState()
  const [owner, setOwner] = useState(false)



 
  const ownerCheck = async () => {
    try{
      let NFTContract = new ethers.Contract(nft_addr, NFT, library);
      // console.log(library._network)
      let Owner = await NFTContract.owner()
      if(Owner == account){
        setOwner(true)
      }else{
        setOwner(false)
      }
  
    }
    catch(error) {
      console.log("error", error)
    }
  } 




    

  const Time = async () => {
    try {
      let signer = await loadProvider();
      let dateNow =  new Date()
      let current = 0
      let timestate = 0
      let NFTCrowdsaleContract = new ethers.Contract(
        nftPreSale_addr,
        NFTCrowdsale,
        signer
      );
      // console.log(library)
      let start = await NFTCrowdsaleContract.start();
      let startDiff = (start - (dateNow/1000))
      let limitationtime = await NFTCrowdsaleContract.limitationtime();
      let limitDiff = (limitationtime - (dateNow/1000))
      let endTime = await NFTCrowdsaleContract.endTime();
      let endDiff = (endTime - (dateNow/1000))
      if(parseInt(start.toString()) == 0){
        current = 0;
        timestate = 0
        setCurrentTime(current)
        // console.log("time state 1:" ,timestate)
        // console.log("time  1:" ,current)
      }else if(startDiff>0){
        start = await NFTCrowdsaleContract.start();
        startDiff = (start - (dateNow/1000))
        current = parseInt(start.toString());
        timestate = 1
        setCurrentTime(parseInt(startDiff))
        // console.log("time state 2:" ,timestate)
        // console.log("time  2:" ,current)
      }else if(limitDiff>0){
        limitationtime = await NFTCrowdsaleContract.limitationtime();
        limitDiff = (limitationtime - (dateNow/1000))
        current = parseInt(limitationtime.toString())
        timestate = 2
        setCurrentTime(parseInt(limitDiff))
        // console.log("time state 2:" ,timestate)
        // console.log("time  2:" ,current)
      }else if(endDiff>0){
        current = parseInt(endTime.toString())
        timestate = 3
        endTime = await NFTCrowdsaleContract.endTime();
        endDiff = (endTime - (dateNow/1000))
        setCurrentTime(parseInt(endDiff))
        // console.log("time state 3:" ,timestate)
        // console.log("time  3:" ,current)
      }else{
        current = 0;
        timestate = 4
        setCurrentTime(current)
        // console.log("time state 4:" ,timestate)
        // console.log("time  4:" ,current)
      }
      
      setTimeState(timestate)
      
    } catch (e) {
      console.log("func :: Time: ", e);
    }
  };
 

  const loadProvider = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // console.log(provider)
      return provider
    } catch (e) {
      console.log("loadProvider: ", e);
    }
  };

  const loadSigner = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      return provider.getSigner();
    } catch (e) {
      console.log("loadProvider default: ", e);
    }
  };



  useEffect(() => {
    (async () => {
      if (account && library) {
        try {
          let len = account.length 
          let short = account.slice(0, 4)+"..." + account.slice(len-5, len-1)
          setShortAddress(short);
          ownerCheck()
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [account,library]);

  useEffect(() => {
    (async () => {
      if (true) {
        try {
        //  console.log("use effect :",library)
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [account,library]);

  useEffect(() => {
    
    if(currentTime > 0){
      const intervalId = setInterval(() => {
      var _days = Math.floor(currentTime/84600)
      if(_days>1){
        _days = _days -1
      }
      var hours = Math.floor(currentTime % (3600*24) / 3600);
      var minutes = Math.floor(currentTime % 3600 / 60);
      var seconds = Math.floor(currentTime % 60);
      setD(_days)
      setH(hours)
      setM(minutes)
      setS(seconds)
        // console.log("Seconds :",seconds)
        // console.log("Minutes :",minutes)
        // console.log("Hours :",hours)
        setCurrentTime(currentTime-1)
        // console.log(currentTime)
      }, 1000);
      return () => clearInterval(intervalId);
    }else{
      console.log("console")
      Time()
    }
    
  }, [currentTime,library]);

  


  return (
    <div>
      <nav className="custom-padding custom-padd-mobile">
        <div className="d-j-flex align-items-center">
          <Link to="/">
            <img className="logo" src={logo} alt="" />
          </Link>
          <div className="d-flex ">
          <div>
            <a href="https://pancakeswap.finance/swap?outputCurrency=0xe9e7cea3dedca5984780bafc599bd69add087d56" target="_blank"className="custom-btn btn-white" >BUY BUSD
            </a>  
            </div>
            <div>
              <Link to="myNft" className="custom-btn btn-white">
                MY NFTS
              </Link>
            </div>
            {owner ? (<div>
              <Link to="airDrop" className="custom-btn btn-white">
                AirDrop
              </Link>
            </div>) : null}



            <a  className="custom-btn btn-white">
              {/* {<img  src="./assets/img/metamask.png" alt="" />} */}
              {active ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* <img height="27" src={metamask} alt="" /> */}
                  <span>{shortAddress}</span>
                </div>
              ) : (
                <div
                  // className="custom-btn btn-white justify-content-center"
                  onClick={() => {
                    connectWallet(activate, props.setErrorMessage);
                  }}
                >
                  {<img height="27" src="./assets/img/metamask.png" alt="" />}
                  Connect Wallet
                </div>
              )}
            </a>
          </div>
        </div>
        <div></div>
      </nav>

      <div>
        <div className="top-bar">
          
          {timeState == 0 ? (<div><h1>SALE WILL START SOON</h1></div>):null}
          {timeState == 1 ? (<div><h1>SALE WILL START IN {d} DAYS {h} HOURS {m} MINUTES {s} SECONDS</h1></div>):null}
          {timeState == 2 ? (<div><h1>SALE DISCOUNT ENDS IN {h} HOURS {m} MINUTES {s} SECONDS</h1></div>):null}
          {timeState == 3 ? (<div><h1>SALE WILL END IN {d} DAYS {h} HOURS {m} MINUTES {s} SECONDS</h1></div>):null}
          {timeState == 4 ? (<div><h1>SALE HAS BEEN ENDED </h1></div>):null}
       
        </div>
      </div>
    </div>
  );
}

export default Header;