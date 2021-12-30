import { useWeb3React } from "@web3-react/core";
import { connectWallet } from "../utils/connectWallet";
import logo from "../assets/img/logo.png";
import metamask from "../assets/img/metamask.png"
import { Link } from "react-router-dom";


function Header(props) {
  const { active, activate } = useWeb3React();

  console.log("is active check = ", active);
  return (
    <div>
      {/* {active ? (
        <div
          style={{
            display: "inline-block",
            backgroundColor: "white",
            borderRadius: "40px",
            padding: "8px",
            border: "1px dashed black",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          Connected
        </div>
      ) : (
        <div
          style={{
            display: "inline-block",
            backgroundColor: "white",
            borderRadius: "40px",
            padding: "8px",
            border: "1px dashed black",
            marginLeft: "10px",
            marginTop: "10px",
            cursor: "pointer",
          }}
          onClick={() => {
            connectWallet(activate, props.setErrorMessage);
          }}
        >
          Connect Wallet
        </div>
      )} */}

      <div className="container-fluid">
        <nav className="custom-padding custom-padd-mobile">
          <div className="d-j-flex align-items-center">
            <Link to="/">
              <img className="logo" src={logo} alt="" />
            </Link>
            <div className="d-flex ">
              <div className="bg-white"  style={{marginRight:"20px", padding:"15px 20px 15px 20px", borderRadius:"20px"}}>
              <Link to="myNft" style={{color:"black", textDecoration:"none", fontWeight:"bold"}}>
              MY NFTS
              </Link>   
             </div>
             <div className="bg-white" style={{ padding:"15px 20px 15px 20px", borderRadius:"20px"}}>
             <Link to="airDrop" style={{color:"black", textDecoration:"none", fontWeight:"bold"}}>
                AirDrop
              </Link>
             </div>
                
              <a
                className="custom-btn btn-white justify-content-center"
                onclick="loadWeb3();"
              >
                {/* <img height="27" src="./assets/img/metamask.png" alt="" />{" "} */}
                {active ? (
                  <div
                   style={{display:"flex", flexDirection:"row", alignItems:"center"}}
                    
                  >
                    <img height="27" src={metamask} alt="" />
                    Connected
                  </div>
                ) : (
                  <div
                    // className="custom-btn btn-white justify-content-center"
                    onClick={() => {
                      connectWallet(activate, props.setErrorMessage);
                    }}
                  >
                    {/* <img height="27" src="./assets/img/metamask.png" alt="" /> */}
                    Connect Wallet
                  </div>
                )}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
