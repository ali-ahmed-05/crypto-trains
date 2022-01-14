import train1 from "../assets/img/train1.jpg"
import train2 from "../assets/img/train2.jpg"
import train3 from "../assets/img/train3.jpg"
import train4 from "../assets/img/train4.jpg"
import train5 from "../assets/img/train5.jpg"
import train6 from "../assets/img/train6.jpg"
import train7 from "../assets/img/train7.jpg"
import discord from "../assets/img/discord.png"
import twitter from "../assets/img/twitter.png"
import telegram from "../assets/img/telegram.png"


import React, { useEffect, useState } from 'react'
import { ethers,BigNumber } from 'ethers'
import {nft_addr, nftPreSale_addr} from "../contract/addresses"
import NFT from "../contract/NFT.json";
import NFTCrowdsale from "../contract/NFTCrowdsale.json"
import Web3Modal from 'web3modal'
import { useWeb3React } from "@web3-react/core";
import MyNft from '../components/MyNft'




const Nfts = () => {

    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        errorWeb3Modal
    } = useWeb3React();
    
    const [count, setCount] = useState()
    const [iswhitelist, setiswhitelist] = useState(false);
    
let journal = [
    {"name":"GOODS TRAIN", "category":"COMMON", "image": train1, "qty": count},
    {"name":"VILLAGE TRAIN", "category":"RARE", "image": train2},
    {"name":"CITY TRAIN", "category":"EPIC", "image": train3},
    {"name":"HIGH-SPEED TRAIN", "category":"LEGENDARY", "image": train4},
     {"name":"GOODS STATION", "category":"COMMON", "image": train5},
     {"name":"CITY STATION", "category":"EPIC", "image": train6},
     {"name":"HIGH-SPEED-STATION", "category":"LEGENDARY", "image": train7},
     
 
    
  ];
    const [balance, setBalance] = useState()

    const [zero, setzero] = useState()
    const [one, setOne] = useState()
    const [two, setTwo] = useState()
    const [three, setThree] = useState()
    const [four, setFour] = useState()
    const [five, setFive] = useState()
    const [six, setSix] = useState()

    const [nftType, setNftType] = useState([])


    const loadProvider = async () => {
        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            return provider.getSigner();
        }
        catch(e){
            console.log("loadProvider: ", e)
        }
    }

    const loadWhiteList = async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer);
            let _whitelist = await NFTCrowdsaleContract.whitelist(account)

            setiswhitelist(_whitelist)
        } catch (e) {
            console.log("data", e)
        }
    }

    const loadNFTs = async () => {
        try {
            
            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(nft_addr, NFT, signer);
            let balanceOf = await NFTCrowdsaleContract.balanceOf(account)
            let balance = balanceOf.toNumber()
            let arr= [] 
            let counter = 0
            for(var i = 0; i < balanceOf; i++) {
              let id = await NFTCrowdsaleContract.tokenOfOwnerByIndex(account,i);
                // console.log("all indexes",id.toString());
                let tokenType = await NFTCrowdsaleContract.tokenType(id)
                let token = tokenType.toNumber()
                // console.log("tokenType", token)
                arr.push(token)
                // console.log("arr", arr)
                if(token == 0) {
                    counter += 1
                    setCount(counter)
                }
                else{
                    console.log("sorry")
                }
                
                
            }
            setNftType(arr)

            let _zero = 0
            let _one =0
            let _two=0
            let _three=0
            let _four=0
            let _five=0
            let _six=0

            for(let i = 0 ; i<arr.length;i++){
                if(arr[i]==0){
                    _zero++;
                }else if(arr[i]==1){
                    _one++;
                }else if(arr[i]==2){
                    _two++;
                }else if(arr[i]==3){
                    _three++;
                }else if(arr[i]==4){
                    _four++;
                }else if(arr[i]==5){
                    _five++;
                }else if(arr[i]==6){
                    _six++;
                }
            }
            setNftType(arr)
            setzero(_zero)
            setOne(_one)
            setTwo(_two)
            setThree(_three)
            setFour(_four)
            setFive(_five)
            setSix(_six)
            
           

            
            setBalance(balance)
            
            // console.log("balanceOf", balance)
           
            // console.log("signer", signer)

        } catch (e) {
            console.log("data", e)
        }
    }

    useEffect(() => {
        (async () => {
            if (account) {
                try {
                    loadNFTs()
                    loadWhiteList()
                } catch (error) {
                    console.log(error)
                }
            }
        })()
    }, [account]);


    
    let type1 = nftType[0];

    
    
   

    

    return (
        <div>
    
    {/* <h1 className="green-head">You are WHITELISTED</h1> */}
    {
                iswhitelist == true ? <>
                    <h1 className="green-head">You are WHITELISTED</h1>
                </>
                    : <>
                        <h1 className="red-head">You are not WHITELISTED</h1>
                    </>
            }
    <div className="container-fluid">
        <div className="custom-padding">
            <div className="row nft-section">
                <h1 className="white-head">MY NFTS</h1>

                {
                    balance==0 ? (<h3 className="white-head">No NFTs</h3>):null
                
                }
                {
                    zero>0 ? ( <MyNft image={train1} name={"GOODS TRAIN"} qty={zero} category={"COMMON"}/>):null
                
                }
                {
                    one>0 ? ( <MyNft image={train2} name={"VILLAGE TRAIN"} qty={one} category={"RARE"}/>):null
                
                }
                {
                    two>0 ? ( <MyNft image={train3} name={"CITY TRAIN"} qty={two} category={"EPIC"}/>):null
                
                }
                {
                    three>0 ? ( <MyNft image={train4} name={"HIGH-SPEED TRAIN"} qty={three} category={"LEGENDARY"}/>):null
                
                }
                {
                    four>0 ? ( <MyNft image={train5} name={"GOODS STATION"} qty={four} category={"COMMON"}/>):null
                
                }
                {
                    five>0 ? ( <MyNft image={train6} name={"CITY STATION"} qty={five} category={"EPIC"}/>):null
                
                }
                {
                    six>0 ? ( <MyNft image={train7} name={"HIGH-SPEED STATION"} qty={six} category={"LEGENDARY"}/>):null
                
                }

                  
                
               {/* { console.log('====>',journal[type1] && journal[type1].name)} */}
                
            </div>
        </div>
     

    <div className="modal fade custom-modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title" id="exampleModalLabel">CONGRATULATIONS! YOU HAVE PURCHASED YOUR NFT</h3>
               <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> 
            </div>
            <div className="modal-body">
              <h1>You can buy 5 NFT per WALLET!</h1>
              <h1>1/5 NFT</h1>
              <div className="d-flex justify-content-center">
                  <a className="custom-btn btn-white" data-bs-dismiss="modal" aria-label="Close">KEEP BUYING</a>
                  <a className="custom-btn btn-white" data-bs-dismiss="modal" aria-label="Close">VIEW MY NFTS</a>
              </div>
            </div>
            <div className="modal-footer">
              
            </div>
          </div>
        </div>
      </div>
        </div>
        </div>
    )
}

export default Nfts
