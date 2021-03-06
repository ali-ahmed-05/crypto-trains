import React, { useEffect, useState } from 'react'
import logo from '../assets/img/logo.png';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { Button } from 'bootstrap';

import { ethers, BigNumber } from 'ethers'
import {nft_addr, nftPreSale_addr, BUSD_addr , nFTpaymentSplitter_addr} from "../contract/addresses"
import NFT from "../contract/NFT.json";
import NFTCrowdsale from "../contract/NFTCrowdsale.json"
import NFTpaymentSplitter from "../contract/NFTpaymentSplitter.json"
import BUSD from "../contract/BUSD.json"
import Web3Modal from 'web3modal'
import { useWeb3React } from "@web3-react/core";
import { generate } from "../components/metadata";
import { parse } from 'csv-parse/lib/sync';

const Airdrop = () => {

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



    const [whiteListAddress, setWhiteListAddress] = useState([])
    const [addr, setAddr] = useState([])
    const [startTime, setStartTime] = useState()
    const [select, setSelect] = useState()
    const [airdropAddr, setAirdropAddr] = useState()
    const [totalValue,setTotalValue]=useState()
    const [share,setShare]=useState()
    const [checkWhiteList, setcheckWhiteList] = useState()
    const [iswhitelist, setiswhitelist] = useState(false);

    const [whitelist, setWhitelist] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [error, setError] = useState()
    const [typeSelect,setTypeSelect] = useState()

    const [limitationAddrError, setLimitationaddrError] = useState()
    const [airDropError, setAirDropError] = useState()
    const [startSaleError, setStartsaleError] = useState()

    const loadProvider = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            return provider.getSigner();
        }
        catch (e) {
            console.log("loadProvider: ", e)
            
        }
    }

    const loadWhiteList = async () => {
        try {

            let signer = await loadProvider()
            setiswhitelist(false)
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer);
            let _whitelist = await NFTCrowdsaleContract.whitelist(checkWhiteList)

            setiswhitelist(_whitelist)
        } catch (e) {
            console.log("data", e)
        }
    }


    const startSale = async () => {
        try {
            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer);
            let startSale = await NFTCrowdsaleContract.startSale(whiteListAddress, nft_addr, startTime)
            let tx = await startSale.wait()
        } catch (e) {
            console.log("error", e)
            // console.log("hjfhj")
            setStartsaleError(e)
            // console.log("limitation",startSaleError)
            handleShow()
            setError(3)

        }
    }

    // console.log("whiteList>>",whiteListAddress)

    const addextraWhitelist = async () => {
        try {
            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer);
            let extraWhitelist = await NFTCrowdsaleContract.add_whitelistAddresses(whiteListAddress)
            let tx = await extraWhitelist.wait()
        //    await setWhiteListAddress([]);
        } catch (e) {
            console.log("data", e)
            setLimitationaddrError(e)
            // console.log("limitation",limitationAddrError)
            handleShow()
            setError(1)

        }
    }



    const airDrop = async () => {
        try {
            let signer = await loadProvider()
            let NFTContract = new ethers.Contract(nft_addr, NFT, signer);
            let meta = generate(typeSelect)
            let acc = ethers.utils.getAddress( airdropAddr )
            let drop = await NFTContract.AirDrop(meta, airdropAddr, typeSelect)
            let tx = await drop.wait()
        } catch (e) {
            setAirDropError(e)
            // console.log("limitation",airDropError)
            handleShow()
            setError(2)
        }
    }

    const loadShare = async () => {
        try {
            let signer = await loadProvider()
            let BUSDContract = new ethers.Contract(BUSD_addr, BUSD, signer)
            let balance = await BUSDContract.balanceOf(nFTpaymentSplitter_addr)
            let NFTpaymentSplitterContract = new ethers.Contract(nFTpaymentSplitter_addr, NFTpaymentSplitter, signer);
            let myShare = await NFTpaymentSplitterContract.pendingBUSD(account)
            setShare(ethers.utils.formatEther(myShare))
            setTotalValue(ethers.utils.formatEther(balance))    
           
            // console.log("balancee :",myShare)


            // console.log("taaaaaaaaaaaaiiiiiiiiiiiiinnnnnnnnnnn: ", data.toString())
        } catch (e) {
            console.log("")
        }
    }

    const retrieve = async () => {
        try {
            let signer = await loadProvider()
            let NFTpaymentSplitterContract = new ethers.Contract(nFTpaymentSplitter_addr, NFTpaymentSplitter, signer);
            let myShare = await NFTpaymentSplitterContract.releaseBUSD(account)
            let tx = await myShare.wait()
        } catch (e) {
            console.log("data :", e)
            // setError(e)
        }
    }
  



    function onKeyUp(event) {
        // if (event.charCode === 13) {
        //     whitelist.push(event.target.value)
        //     event.target.value = '';
        // }

    if(event.target.files.length>0){
        let file = event.target.files[0];
        let whiteListTempArr = [];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            const records = parse(Buffer(reader.result), {
                columns: false,
                skip_empty_lines: true,
            });
            records.map((item)=>{
                whiteListTempArr.push(ethers.utils.getAddress(item[0]))
            })
            
            setWhiteListAddress(whiteListTempArr)
        };
    }



    }

    function onKeyUp2(event) {
        if (event.charCode === 13) {
            checkWhiteList.push(event.target.value)
            event.target.value = '';
        }
    }



    useEffect(() => {
        (async () => {
            if (account) {
                try {
                    loadShare()

                } catch (error) {
                    console.log(error)
                }
            }
        })()
    }, [account]);

    useEffect(() => {
        // console.log(whiteListAddress)
    }, [whiteListAddress]);


    return (
        <div>
            <div className="container-fluid">
            
                <Row>
                    <Col lg={5} className='m-auto'>
                    
                        <div className='custom-form'>
                        <h1 className='text-white'>Amount Raised</h1>
                        
                        <p className='text-white' style={{fontSize:'20px'}}>Total BUSD : {totalValue} BUSD</p>
                        <p className='text-white' style={{fontSize:'20px'}}>Your Share : {share} BUSD</p>
                        <button onClick={()=>retrieve()} className='custom-btn btn-white'>Retrieve</button>
                       
                        </div>
                    </Col>
                </Row>

            </div>
            <div className="container-fluid">
           
                <Row>
                    <Col lg={5} className='m-auto'>
                    
                        <div className='custom-form'>
                        
                            <h1 className='text-white'>Start Pre-Sale</h1>

                            {error == 3 ? (
                                
                                <Modal show={show} onHide={handleClose}  className='custom-modal' size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                    <Modal.Header > <div style={{textAlign:"center"}}>
                                          <p style={{ width:"800px", color:"red"}} >{startSaleError.message.toString() || startSaleError.toString()}</p>
                                          </div></Modal.Header>
                                
                            </Modal>
                            
                        ): null}

                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail" >
                                    <div style={{display:"flex", flexDirection:"row",justifyContent:"space-around" ,marginTop:"10px"}}>
                                    <Form.Label><div >Whitelist Addresses</div></Form.Label>
                                    <Form.Label ><div style={{textAlign:"right"}} >Limit 1000</div></Form.Label>
                                    </div>
                                    <Form.Control type="file" placeholder="Whitelist Addresses" onChange={(e)=>onKeyUp(e)} />
                                    {/* <Form.Control type="text" placeholder="Whitelist Addresses" onKeyPress={(e)=>onKeyUp(e)} /> */}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control type="number" placeholder="Start Time" onChange={(e) => setStartTime(e.target.value)} />
                                </Form.Group>

                            </Form>
                            <button onClick={startSale} className='custom-btn btn-white'>Submit</button>
                            {/* <button className='custom-btn btn-white' onClick={handleShow}>
        View
      </button> */}

                           </div>
                    </Col>
                </Row>

            </div>



            <div className="container-fluid">
           
                <Row>
                    <Col lg={5} className='m-auto'>
                    
                        <div className='custom-form'>
                        
                            <h1 className='text-white'>Set whitelist addresses</h1>
                            {/* {console.log("error>>", error)} */}
                            {error == 1 ? (
                                
                                    <Modal show={show} onHide={handleClose}  className='custom-modal' size="lg"
                                    aria-labelledby="contained-modal-title-vcenter"
                                    centered>
                                        <Modal.Header > <div style={{textAlign:"center"}}>
                                              <p style={{width:"800px", color:"red"}} >{limitationAddrError.message.toString() || limitationAddrError.toString()}</p>
                                              </div></Modal.Header>
                                    
                                </Modal>
                                
                            ): null}

                            <Form>
                                

                            <Form.Group className="mb-3" controlId="formBasicEmail" >
                                    <div style={{display:"flex", flexDirection:"row",justifyContent:"space-around" ,marginTop:"10px"}}>
                                    <Form.Label><div >Whitelist Addresses</div></Form.Label>
                                    <Form.Label ><div style={{textAlign:"right"}} >Limit 1000</div></Form.Label>
                                    </div>
                                    <Form.Control type="file" placeholder="Whitelist Addresses" onChange={(e)=>onKeyUp(e)} />
                                    {/* <Form.Control type="text" placeholder="Whitelist Addresses" onKeyPress={(e)=>onKeyUp(e)} /> */}
                                </Form.Group>

                            </Form>
                            <button onClick={addextraWhitelist} className='custom-btn btn-white'>Submit</button>
                            {/* <button className='custom-btn btn-white' onClick={handleShow}>
        View
      </button> */}

                     </div>
                    </Col>
                </Row>

            </div>



            <div className="container-fluid">
           
                <Row>
                    <Col lg={5} className='m-auto'>
                    
                        <div className='custom-form'>
                        
                            <h1 className='text-white'>Check Whitelist</h1>
                            <Form>
                            <p className='whitelist'>
                                {
                                        iswhitelist == true ? (

                                            <p className="green-head">WHITELISTED</p>
                                        )
                                        
                                            : (<p className="red-head">Not WHITELISTED</p> )
                                                    
                                    }
                            </p>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Check WhiteList</Form.Label>
                                    <Form.Control type="text" placeholder="Check WhiteList" 
                                    onChange={(e) => 
                                        setcheckWhiteList(e.target.value)  }  />
                                          
                                </Form.Group>

                            </Form>
                            
                            <button className='custom-btn btn-white' onClick={loadWhiteList}>Check</button>

                 </div>
                    </Col>
                </Row>

            </div>


            <div className="container-fluid">
                <Row>
                    <Col lg={5} className='m-auto'>
                        <div className='custom-form'>
                            <h1 className='text-white'>Air-Drop</h1>

                            {error == 2 ? (
                                
                                <Modal show={show} onHide={handleClose}  className='custom-modal' size="lg"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                    <Modal.Header > <div style={{textAlign:"center"}}>
                                          <p style={{width:"800px", color:"red"}} >{ airDropError.message.toString() || airDropError.toString() }</p>
                                          </div></Modal.Header>
                                
                            </Modal>
                            
                        ): null}

                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Whitelist Addresses</Form.Label>
                                    <Form.Control type="text" placeholder="Whitelist Addresses" onChange={(e) => setAirdropAddr(e.target.value)} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Select NFT Type</Form.Label>
                                    <Form.Select value={typeSelect} onChange={(e)=>setTypeSelect(e.target.value)} aria-label="Default select example" name="select">
                                        <option >Select Type</option>
                                        <option value="0">GOODS TRAIN</option>
                                        <option value="1">VILLAGE TRAIN</option>
                                        <option value="2">CITY TRAIN</option>
                                        <option value="3">HIGH-SPEED TRAIN</option>
                                        <option value="4">GOODS STATION</option>
                                        <option value="5">CITY STATION</option>
                                        <option value="6">HIGH-SPEED-STATION</option>
                                    </Form.Select>
                                </Form.Group>



                            </Form>
                            <button className='custom-btn btn-white' onClick={()=>airDrop()} >Submit</button>
                        </div>
                    </Col>
                </Row>

            </div>
            <div
                className="modal fade custom-modal"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="exampleModalLabel">
                                CONGRATULATIONS! YOU HAVE PURCHASED YOUR NFT
                            </h3>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <h1>You can buy 5 NFT per WALLET!</h1>
                            <h1>1/5 NFT</h1>
                            <div className="d-flex justify-content-center">
                                <a className="custom-btn btn-white" data-bs-dismiss="modal" aria-label="Close">
                                    KEEP BUYING
                                </a>
                                <a className="custom-btn btn-white" data-bs-dismiss="modal" aria-label="Close">
                                    VIEW MY NFTS
                                </a>
                            </div>
                        </div>
                        <div className="modal-footer" />
                    </div>
                </div>
            </div>



            



        </div>
    );
};

export default Airdrop;