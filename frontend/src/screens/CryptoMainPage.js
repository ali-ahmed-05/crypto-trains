import React, { useEffect, useState } from 'react'
import train1 from "../assets/img/train1.jpg"
import train2 from "../assets/img/train2.jpg"
import train3 from "../assets/img/train3.jpg"
import train4 from "../assets/img/train4.jpg"
import train5 from "../assets/img/train5.jpg"
import train6 from "../assets/img/train6.jpg"
import train7 from "../assets/img/train7.jpg"
import busd from "../assets/img/busd.svg"
import { ethers,BigNumber } from 'ethers'
import {nft_addr, nftPreSale_addr, BUSD_addr} from "../contract/addresses"
import NFT from "../contract/NFT.json";
import NFTCrowdsale from "../contract/NFTCrowdsale.json"
import BUSD from "../contract/BUSD.json"
import Web3Modal from 'web3modal'
import { useWeb3React } from "@web3-react/core";
import { Button, Modal, Spinner } from 'react-bootstrap'
import Countdown from 'react-countdown';
import {generate} from "../components/metadata"
import {Link} from "react-router-dom"




export default function CryptoMainPage() {

    const [Train_common_limit, setTrain_common_limit] = useState()
    const [Train_rare_limit, setTrain_rare_limit] = useState()
    const [Train_epic_limit, setTrain_epic_limit] = useState()
    const [Train_legendary_limit, setTrain_legendary_limit] = useState()
    const [Station_common_limit, setStation_common_limit] = useState()
    const [Station_mitic_limit, setStation_mitic_limit] = useState()
    const [Station_Legendary_limit, setStation_Legendary_limit] = useState()

    const [Train_common, setTrain_common] = useState()
    const [Train_rare, setTrain_rare] = useState()
    const [Train_epic, setTrain_epic] = useState()
    const [Train_legendary, setTrain_legendary] = useState()
    const [Station_common, setStation_common] = useState()
    const [Station_mitic, setStation_mitic] = useState()
    const [Station_Legendary, setStation_Legendary] = useState()
    const [balance, setBalance] = useState();
    const [issalestart, setissalestart] = useState(true);
    const [iswhitelist, setiswhitelist] = useState(false);

    const [Train_common_limit_price, setTrain_common_limit_price] = useState()
    const [Train_rare_limit_price, setTrain_rare_limit_price] = useState()
    const [Train_epic_limit_price, setTrain_epic_limit_price] = useState()
    const [Train_legendary_limit_price, setTrain_legendary_limit_price] = useState()
    const [Station_common_limit_price, setStation_common_limit_price] = useState()
    const [Station_mitic_limit_price, setStation_mitic_limit_price] = useState()
    const [Station_Legendary_limit_price, setStation_Legendary_limit_price] = useState()

    const [loading, setLoading] = useState("loading")
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [purchased, setPurchased] = useState()
    const [heading, setHeading] = useState('APPROVING')
    const [loaderstatus, setLoaderstatus] = useState('approve')
    const [startTime, setStartTime] = useState(10000)

    // console.log("handleClose", show)

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

   

    const loadProvider = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
        //   console.log(provider)
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

    const loadLimit = async () => {
        try {

            let signer = await loadProvider()
            let NFTcontract = new ethers.Contract(nft_addr, NFT, signer);
            let Train_common_limit = await NFTcontract.Train_common_limit()
            let Train_rare_limit = await NFTcontract.Train_rare_limit()
            let Train_epic_limit = await NFTcontract.Train_epic_limit()
            let Train_legendary_limit = await NFTcontract.Train_legendary_limit()
            let Station_common_limit = await NFTcontract.Station_common_limit()
            let Station_mitic_limit = await NFTcontract.Station_mitic_limit()
            let Station_Legendary_limit = await NFTcontract.Station_Legendary_limit()
            // console.log("load :", Train_common_limit)

            setTrain_common_limit(parseInt(Train_common_limit.toString()))
            setTrain_rare_limit(parseInt(Train_rare_limit.toString()))
            setTrain_epic_limit(parseInt(Train_epic_limit.toString()))
            setTrain_legendary_limit(parseInt(Train_legendary_limit.toString()))
            setStation_common_limit(parseInt(Station_common_limit.toString()))
            setStation_mitic_limit(parseInt(Station_mitic_limit.toString()))
            setStation_Legendary_limit(parseInt(Station_Legendary_limit.toString()))

            let Train_common = await NFTcontract.Train_common()
            let Train_rare = await NFTcontract.Train_rare()
            let Train_epic = await NFTcontract.Train_epic()
            let Train_legendary = await NFTcontract.Train_legendary()
            let Station_common = await NFTcontract.Station_common()
            let Station_mitic = await NFTcontract.Station_mitic()
            let Station_Legendary = await NFTcontract.Station_Legendary()

            setTrain_common(parseInt(Train_common.toString()))
            setTrain_rare(parseInt(Train_rare.toString()))
            setTrain_epic(parseInt(Train_epic.toString()))
            setTrain_legendary(parseInt(Train_legendary.toString()))
            setStation_common(parseInt(Station_common.toString()))
            setStation_mitic(parseInt(Station_mitic.toString()))
            setStation_Legendary(parseInt(Station_Legendary.toString()))

            
            
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer)
            let Train_common_Price = await NFTCrowdsaleContract.getPrice(0)
            let Train_rare_Price = await NFTCrowdsaleContract.getPrice(1)
            let Train_epic_Price = await NFTCrowdsaleContract.getPrice(2)
            let Train_legendary_Price = await NFTCrowdsaleContract.getPrice(3)
            let Station_common_Price = await NFTCrowdsaleContract.getPrice(4)
            let Station_mitic_Price = await NFTCrowdsaleContract.getPrice(5)
            let Station_Legendary_Price = await NFTCrowdsaleContract.getPrice(6)

            setTrain_common_limit_price(ethers.utils.formatEther(Train_common_Price))
            setTrain_rare_limit_price(ethers.utils.formatEther(Train_rare_Price))
            setTrain_epic_limit_price(ethers.utils.formatEther(Train_epic_Price))
            setTrain_legendary_limit_price(ethers.utils.formatEther(Train_legendary_Price))
            setStation_common_limit_price(ethers.utils.formatEther(Station_common_Price))
            setStation_mitic_limit_price(ethers.utils.formatEther(Station_mitic_Price))
            setStation_Legendary_limit_price(ethers.utils.formatEther(Station_Legendary_Price))

            

            setLoading("loaded")




            // console.log("taaaaaaaaaaaaiiiiiiiiiiiiinnnnnnnnnnn: ", data.toString())
        } catch (error) {
            console.log("data :", error)
        }
    }


    // console.log("Train_common_limit", Train_common_limit_price)

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



    const buynft = async (no) => {
        try {
            handleShow("APPROVING")
            let signer = await loadSigner()
           
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer)
          
           

            
            let BUSDContract = new ethers.Contract(BUSD_addr, BUSD, signer)
            let _value = await NFTCrowdsaleContract.getPrice(no)
            let uri = generate(no)
            // console.log("value>>", _value.toString())
            let allowanceCheck = await BUSDContract.allowance(account,nftPreSale_addr)
            
            allowanceCheck = parseInt(allowanceCheck.toString())
            //  console.log("allowance :",allowanceCheck);
            if(allowanceCheck < parseInt(_value.toString())){
                
                let allowance = await BUSDContract.approve(nftPreSale_addr, _value)
                let allowanceTX = await allowance.wait()
                if (allowanceTX && allowanceTX.blockNumber) {
                    setHeading("BUYING")
                        let buy = await NFTCrowdsaleContract.buyNFTV1(no, uri)
                        let tx = await buy.wait()
                        // {console.log("tx>>", tx)}
                        let userPurchased = await NFTCrowdsaleContract.userPurchased(account)
                        setPurchased(parseInt(userPurchased.toString()))
                        // console.log("purchased", purchased)
                        // console.log("userPurchased", userPurchased)
                        if (tx.confirmations >= 1) {
                            setHeading("Finishh")
                            loadLimit()
                            // handleShow()
                        }
                        else{
                            console.log("Erroor",tx.confirmations)
                        }
                }                            
            }else{
               setHeading("BUYING")
                let buy = await NFTCrowdsaleContract.buyNFTV1(no, uri)
                // handleShow1()
                let tx = await buy.wait()
                // console.log("tx>>>", tx)
                let userPurchased = await NFTCrowdsaleContract.userPurchased(account)
                setPurchased(parseInt(userPurchased.toString()))
                // console.log("purchased", purchased)
                // {console.log("tx>>", tx.confirmations)}
                // console.log("userPurchased", userPurchased)
                if (tx.confirmations >= 1) {
                    setHeading("Finish")
                    loadLimit()
                    handleShow()
                }
            }
            

        }
        catch (e) {
            console.log("error", e)
            setHeading("RejectedError")
        }
    }

    useEffect(() => {
        (async () => {
            
                try {
                    loadLimit()
                } catch (error) {
                    console.log(error)
                }
            
        })()
    }, []);



    useEffect(() => {
        (async () => {
            if (account) {
                try {
                    loadLimit()
                    loadWhiteList()


                } catch (error) {
                    console.log(error)
                }
            }
        })()
    }, [account]);

   

    return (
        <div>
           
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
                        <h1 className="white-head">TRAINS</h1>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Train_common_limit - Train_common}/${Train_common_limit}`}</h6>
                                <img className="nft-box" src={train1} alt="" style={{ borderColor: "#258fad" }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>GOODS TRAIN</h5>
                                        <div className="tag" >
                                            <h6 style={{ background: "#258fad" }}>COMMON</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Train_common_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={(e) => {
                                           buynft(0)
                                           setHeading("APPROVING")

                                        }} className="custom-btn btn-green" >Buy NFT</button>

                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Train_rare_limit - Train_rare}/${Train_rare_limit}`}</h6>
                                <img className="nft-box" src={train2} alt="" style={{ borderColor: '#4AA41F' }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>VILLAGE TRAIN</h5>
                                        <div className="tag">
                                            <h6 style={{ background: "#4AA41F" }}>RARE</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Train_rare_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => {
                                            buynft(1)
                                            setHeading("APPROVING")

                                        }} className="custom-btn btn-green" >Buy NFT</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Train_epic_limit - Train_epic}/${Train_epic_limit}`}</h6>
                                <img className="nft-box" src={train3} alt="" style={{ borderColor: "#745ca4" }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>CITY TRAIN</h5>
                                        <div className="tag">
                                            <h6 style={{ background: "#745ca4" }} >EPIC</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Train_epic_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => {
                                            buynft(2)
                                            setHeading("APPROVING")

                                        }} className="custom-btn btn-green" >Buy NFT</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Train_legendary_limit - Train_legendary}/${Train_legendary_limit}`}</h6>
                                <img className="nft-box" src={train4} alt="" style={{ borderColor: "#ECCC43" }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>HIGH-SPEED TRAIN</h5>
                                        <div className="tag">
                                            <h6 style={{ background: "#ECCC43" }} >LEGENDARY</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Train_legendary_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => {
                                            buynft(3)
                                            setHeading("APPROVING")

                                        }} className="custom-btn btn-green" >Buy NFT</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div className="custom-padding">
                    <div className="row nft-section">
                        <h1 className="white-head">STATIONS</h1>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Station_common_limit - Station_common}/${Station_common_limit}`}</h6>
                                <img className="nft-box" src={train5} alt="" style={{ borderColor: "#258fad" }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>GOODS STATION</h5>
                                        <div className="tag">
                                            <h6 style={{ background: "#258fad" }} >COMMON</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Station_common_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => {
                                            buynft(4)
                                            setHeading("APPROVING")

                                        }} className="custom-btn btn-green" >Buy NFT</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Station_mitic_limit - Station_mitic}/${Station_mitic_limit}`}</h6>
                                <img className="nft-box" src={train6} alt="" style={{ background: "#745ca4" }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>CITY STATION</h5>
                                        <div className="tag">
                                            <h6 style={{ background: "#745ca4" }} >EPIC</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Station_mitic_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => {
                                            buynft(5)

                                        }} className="custom-btn btn-green" >Buy NFT</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6 position-relative">
                            <div className="nft">
                                <h6 className="nft-box-head">{loading === "loading" ? (<p>loading</p>) : `${Station_Legendary_limit - Station_Legendary}/${Station_Legendary_limit}`}</h6>
                                <img className="nft-box" src={train7} alt="" style={{ background: "#ECCC43" }} />
                                <div className="text-section">
                                    <div className="tag-section">
                                        <h5>HIGH-SPEED STATION</h5>
                                        <div className="tag">
                                            <h6 style={{ background: "#ECCC43" }} >LEGENDARY</h6>
                                        </div>
                                    </div>
                                </div>
                                <div className="price-section">
                                    <div className="d-flex justify-content-center">
                                        <span className="text-center">{Station_Legendary_limit_price} BUSD</span>
                                        <img src={busd} alt="" />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => {
                                            buynft(6)

                                        }} className="custom-btn btn-green" >Buy NFT</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            {/* {console.log("hh>>", heading)} */}
            <Modal show={show} onHide={handleClose}  className='custom-modal' size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                    {heading== "APPROVING" ||  heading == "BUYING"?
                      (<Modal.Header > <div style={{textAlign:"center"}}>
                          <h1>{heading}</h1>
                          <div><Spinner animation="border" variant="success" /></div>
                          </div></Modal.Header>)
                    :  heading == "RejectedError" ? (<Modal.Body><div><h1 style={{color:"red"}}>Rejected</h1></div></Modal.Body>) 
                   
                     : heading== "Finishh" || heading=="Finish" ? (<div style={{textAlign:"center"}} >
                        <Modal.Header >
                    <h3 className="modal-title" id="exampleModalLabel">CONGRATULATIONS! YOU HAVE PURCHASED YOUR NFT</h3>
                </Modal.Header>
                <Modal.Body>
                    <h1>You can buy 5 NFT per WALLET!</h1>
                    <h1>{`${purchased}/5 NFT`}</h1>
                    <div className="d-flex justify-content-center">
                        <a className="custom-btn btn-white" onClick={handleClose}>KEEP BUYING</a>
                        <Link to={'/myNft'} className="custom-btn btn-white">VIEW MY NFTS</Link>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
                    </div>) : null}

                
            </Modal>

            
            


        </div>
    )
}


