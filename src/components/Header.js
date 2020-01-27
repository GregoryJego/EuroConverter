import React from "react";
import flag from "../images/european-union.png"

const Header = () => {
    return <div className={"header"}><div className="wrapper"><h1>Convertisseur EUROS</h1><img src={flag} width="70px" style={{ marginLeft: "1rem" }} alt="euro-flag" /></div></div>
}

export default Header