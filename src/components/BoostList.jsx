import BoostData from "../data/BoostData";
import "../css/BoostList.css";

const formatDescription = (desc) => {
  const highlightRegex = /(\d+x|\d+[a-zA-Z]+|\+\d+%)/g;

  const formattedDesc = desc.replace(
    highlightRegex,
    (match) => `<span class="highlight">${match}</span>`
  );

  return <span dangerouslySetInnerHTML={{ __html: formattedDesc }} />;
};

const BoostList = () => {
  return (
    <div className="boost-list">
      {BoostData.map((boost, index) => (
        <div key={index} className="boost-item">
          <img src={boost.img} alt={boost.name} className="boost-image" />
          <div className="boost-info">
            <h3 className="boost-name">{boost.name}</h3>
            <p className="boost-desc">{formatDescription(boost.desc)}</p>
          </div>
          <div className="boost-price">
            <span>buy</span>{" "}
            <div className="price-container">
              <img
                src="../../public/assets/Eggs/GoldenEgg.png"
                alt="goldenEgg"
                className="price-logo"
              />
              {boost.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoostList;
