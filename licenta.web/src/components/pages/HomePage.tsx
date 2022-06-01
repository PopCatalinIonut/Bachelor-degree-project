import { MenuList, MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { logout} from "../../features/slices/UserSlice";
import { useEffect } from "react";
import ProfilePage from "./ProfilePage";
import MarketplacePage from "./MarketplacePage";
import OutfitGeneratorPage from "./OutfitGeneratorPage";
import ChatPage from "./ChatPage";
import AddItemPage from "./AddItemPage";
import WishlistPage from "./WishlistPage";

const styles = {
  menuItem: {
    borderLeft:"1px solid white",
    borderRight:"1px solid white",
    height:40,
    paddingTop:0,
    borderTop:0,
    paddingBottom: 0
  }as React.CSSProperties,
  menuItemLeft:{
    borderLeft:"2px solid white",
    borderRight:"1px solid white",
    height:40,
    paddingTop:0,
    borderTop:0,
    paddingBottom: 0
  } as React.CSSProperties,
  menuItemRight:{
    borderLeft:"1px solid white",
    borderRight:"2px solid white",
    height:40,
    paddingTop:0,
    borderTop:0,
    paddingBottom: 0
  } as React.CSSProperties,
}
type LocationState = {
  key: string
}
export default function HomePage() {

  const dispatch = useAppDispatch();
  let navigate = useNavigate(); 

  const handleLogout = () =>{ 
    dispatch<any>(logout());
    navigate("/")
  }
  const location = useLocation();

  const pageContent = () =>{
    
    if(location.state !== null){
      const {key} = location.state as LocationState;
      switch(key){
        case "marketplace": return <MarketplacePage></MarketplacePage>
        case "outfit": return <OutfitGeneratorPage></OutfitGeneratorPage>
        case "chat": return <ChatPage></ChatPage>
        case "addItem": return <AddItemPage></AddItemPage>
        case "wishlist": return <WishlistPage></WishlistPage>
        case "profile": return <ProfilePage></ProfilePage>
      }
    }
  }

  return (
    <div style={{textAlign:"center"}}>
        <div style={{background:"rgb(102,0,204)",height:40}}>   
            <MenuList style={{minHeight:70,display:"flex",width:"100%",textAlign:"center",justifyContent:"center",color:"white",paddingTop:0}}>
                <MenuItem style={styles.menuItemLeft} onClick={() => {navigate("/home",{state:{key:"profile"}})}}>Profile</MenuItem>
                <MenuItem style={styles.menuItem} onClick={() => {navigate("/home",{state:{key:"wishlist"}})}}>Wishlist</MenuItem>
                <MenuItem style={styles.menuItem} onClick={() => {navigate("/home",{state:{key:"marketplace"}})}}>Marketplace</MenuItem>
                <MenuItem style={styles.menuItem} onClick={() => {navigate("/home",{state:{key:"outfit"}})}}>Looking for an outfit?</MenuItem>
                <MenuItem style={styles.menuItem} onClick={() => {navigate("/home",{state:{key:"chat"}})}}>Chat</MenuItem>
                <MenuItem style={styles.menuItemRight} onClick={() => {navigate("/home",{state:{key:"addItem"}})}}>Want to sell something?</MenuItem>
            </MenuList>
            <MenuItem onClick={handleLogout} style={{position:"absolute",height:40,
                right:0,top:0,color:"white",borderLeft:"2px solid white",padding:10 }}>Log out
            </MenuItem>
        </div> 
        {pageContent()}
    </div>
  );
}