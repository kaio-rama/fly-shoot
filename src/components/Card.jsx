import ak47 from "../assets/images/ak47.png";
import lego from "../assets/images/lego47.png";
import "../index.css";

export default function Card() {
  return (
    <div style={{ display: "flex", 
                justifyContent: "center",
                width: "100%",
                alignItems: "center", 
                marginBottom: 15 , 
                background:"#00000000",
                position: "absolute", 
                bottom: 0,
                }}>

    <div id="akSkin" style={{ opacity: 0, padding: 20, background:"#33333366", borderRadius: 10, boxShadow: "0 0 10px rgba(0,0,0,0.2)",  marginLeft: 50, transition: "opacity .5s linear" }}>
        <img src={ak47} alt="akSkin" style={{ width: 200, height: 100, objectFit: "fill", borderRadius: 10, boxShadow: "0 0 10px rgba(3,10,6,2.2)"}}  />
        
    </div>
    <div id="legoSkin" style={{ opacity: 0, padding: 20, background:"#33333366", borderRadius: 10, boxShadow: "0 0 10px rgba(0,0,0,0.2)",  marginLeft: 50, transition: "opacity .5s linear" }}>
        <img src={lego} alt="legoSkin" style={{ width: 200, height: 100, objectFit: "fill", borderRadius: 10, boxShadow: "0 0 10px rgba(3,10,6,2.2)" }}  /> 

    </div>
    </div>
  )
}
