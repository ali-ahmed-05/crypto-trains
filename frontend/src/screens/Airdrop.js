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
    // console.log(addr)

    const [typeSelect,setTypeSelect] = useState()
    // console.log("select", typeSelect)

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
           // let NFTpaymentSplitterContract = new ethers.Contract(nFTpaymentSplitter_addr, NFTpaymentSplitter, signer);

           // let estimateGas = await NFTpaymentSplitterContract.estimateGas.releaseBUSD("0x0259FC8c828255fA7b90D928b3939f6944475ba7")
            // console.log("account", account)
            // let _gasPrice =  22025072 * 4
            // let options = { gasLimit: _gasPrice};
            // let estimateGas = await NFTCrowdsaleContract.estimateGas.startSale(whiteListAddress, nft_addr, startTime,options);
            
           let startSale = await NFTCrowdsaleContract.startSale(whiteListAddress, nft_addr, startTime)
            // const estimation = await erc20.estimateGas.transfer(recipient, 100);
           let tx = await startSale.wait()
           // console.log("startSale", estimateGas.toString())
        } catch (e) {
            console.log("data", e)
        }
    }
    const addextraWhitelist = async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(nftPreSale_addr, NFTCrowdsale, signer);
            let extraWhitelist = await NFTCrowdsaleContract.add_whitelistAddresses(whiteListAddress)
            let tx = await extraWhitelist.wait()
        } catch (e) {
            console.log("data", e)
        }
    }



    const airDrop = async () => {
        try {

            let signer = await loadProvider()
            let NFTContract = new ethers.Contract(nft_addr, NFT, signer);
            let meta = generate(typeSelect)
            // console.log({typeSelect})
            let acc = ethers.utils.getAddress( airdropAddr )
            //  console.log("meta", meta)
            // console.log({airdropAddr})

            let drop = await NFTContract.AirDrop(meta, airdropAddr, typeSelect)
            let tx = await drop.wait()

            // console.log("startSale", drop)
        } catch (e) {
            console.log("data", e)
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
           
            console.log("balancee :",NFTpaymentSplitterContract)


            // console.log("taaaaaaaaaaaaiiiiiiiiiiiiinnnnnnnnnnn: ", data.toString())
        } catch (error) {
            console.log("data :", error)
        }
    }

    const retrieve = async () => {
        try {
            let signer = await loadProvider()
            let NFTpaymentSplitterContract = new ethers.Contract(nFTpaymentSplitter_addr, NFTpaymentSplitter, signer);
            let myShare = await NFTpaymentSplitterContract.releaseBUSD(account)
            let tx = await myShare.wait()
           

          


            // console.log("taaaaaaaaaaaaiiiiiiiiiiiiinnnnnnnnnnn: ", data.toString())
        } catch (error) {
            console.log("data :", error)
        }
    }
    const [whitelist, setWhitelist] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow1(false);
    const handleShow = () => setShow1(true);

    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow(false);
    const handleShow1 = () => setShow(true);

    function onKeyUp(event) {
        if (event.charCode === 13) {
            whitelist.push(event.target.value)
            event.target.value = '';
        }

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
        console.log(whiteListAddress)
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
                            <Form>
                                <Form.Group className="mb-3" controlId="formBasicEmail" >
                                    <div style={{display:"flex", flexDirection:"row",justifyContent:"space-around" ,marginTop:"10px"}}>
                                    <Form.Label><div >Whitelist Addresses</div></Form.Label>
                                    <Form.Label ><div style={{textAlign:"right"}} >Limit 1000</div></Form.Label>
                                    </div>
                                    <Form.Control type="file" placeholder="Whitelist Addresses" onChange={(e)=>onKeyUp2(e)} />
                                    {/* <Form.Control type="text" placeholder="Whitelist Addresses" onKeyPress={(e)=>onKeyUp(e)} /> */}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control type="number" placeholder="Start Time" onChange={(e) => setStartTime(e.target.value)} />
                                </Form.Group>

                            </Form>
                            <button onClick={startSale} className='custom-btn btn-white'>Submit</button>
                            <button className='custom-btn btn-white' onClick={handleShow}>
        View
      </button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className='custom-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Whitelist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className='whitelist'>
          {whitelist.map(animal => (
            <li>{animal}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <button className='custom-btn btn-white'  onClick={handleClose}>
            Close
          </button>
     
        </Modal.Footer>
      </Modal>                        </div>
                    </Col>
                </Row>

            </div>



            <div className="container-fluid">
           
                <Row>
                    <Col lg={5} className='m-auto'>
                    
                        <div className='custom-form'>
                        
                            <h1 className='text-white'>Check Whitelist</h1>
                            <Form>
                               

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Check WhiteList</Form.Label>
                                    <Form.Control type="text" placeholder="Check WhiteList" onChange={(e) => setcheckWhiteList(e.target.value)} />  
                                </Form.Group>

                            </Form>
                            
                            <button className='custom-btn btn-white' onClick={handleShow1}>View</button>

      <Modal
        show={show}
        onHide={handleClose1}
        backdrop="static"
        keyboard={false}
        className='custom-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Whitelist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='whitelist'>
          {
                iswhitelist == true ? (

                    <p className="green-head">You are WHITELISTED</p>
                )
                
                    : (<p className="red-head">You are not WHITELISTED</p>)
                    
            }
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className='custom-btn btn-white'  onClick={handleClose1}>
            Close
          </button>
     
        </Modal.Footer>
      </Modal>                        </div>
                    </Col>
                </Row>

            </div>


            <div className="container-fluid">
                <Row>
                    <Col lg={5} className='m-auto'>
                        <div className='custom-form'>
                            <h1 className='text-white'>Air-Drop</h1>
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