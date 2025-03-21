import { bitcoin } from "../assets/images";

const VaultInput = ({ text, setText, title, subtitle, placeholder }) => {
  //   const [name, setName] = useState("");

  return (
    <div
      style={{
        // width: "100%",
        backgroundColor: "#343e4b",
        borderRadius: "4px",
        padding: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>{title}</h3>
        <div>
          <img src={bitcoin} width={"40px"} alt="Bitcoin" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          padding: "10px",
          backgroundColor: "#47505D",
          gap: "20px",
          borderRadius: "5px",
          justifyContent: "space-between",
        }}
      >
        <div>{subtitle}</div>
        <input
          className="no-hover-input"
          style={{ background: "transparent", border: "none" }}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default VaultInput;
