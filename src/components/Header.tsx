
import Nav from "./Nav";
import "./header.css";

export default function Header() {

    return (
        <>
            <div className="site-header">
                <div className="header-inner">
                    <div className="header-left"><h1>DDR</h1></div>
                    <div className="header-nav"></div>
                    <div className="header-right"><Nav /></div>
                </div>
            </div>
        </>
    );
}
