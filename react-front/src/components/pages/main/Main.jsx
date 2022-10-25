import Topbar from "../topbar/Topbar"
import Feed from "../feed/Feed"
import "./main.css"


export default function Main() {
    return (
      <>
        <Topbar />
        <div className="mainContainer">
          <Feed/>
         
        </div>
      </>
    );
  }