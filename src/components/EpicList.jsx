import React, { useState, useRef, useEffect } from "react";
import EpicListData from "../data/EpicListData";
import "../css/CommonList.css";

const formatDescription = (desc) => {
  const highlightRegex =
    /(\+\d+\.\d+%|\d+\.\d+%|\d+%|\d+\.\d+x|\d+x|\d{2,3}|\bTRIPLES\b|\bDOUBLES\b|\d)/g;
  const formattedDesc = desc.replace(
    highlightRegex,
    (match) => `<span class="highlight epic">${match}</span>`
  );
  return <span dangerouslySetInnerHTML={{ __html: formattedDesc }} />;
};

// Formatage simplifié (uniquement pour les millions)
const formatNumberWithSuffix = (num) => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
  }
  return num.toFixed(num < 10 ? 2 : 0);
};

const EpicList = () => {
  const [upgrades, setUpgrades] = useState(
    EpicListData.map(() => ({ current: 0 }))
  );
  const [isHold, setIsHold] = useState(Array(EpicListData.length).fill(false));
  const holdTimerRef = useRef([]);

  const getCurrentPrice = (index) => {
    const { basePrice } = EpicListData[index];
    const { current } = upgrades[index];
    const ratio = 1.1;
    return parseFloat(basePrice) * Math.pow(ratio, current);
  };

  const handleMouseDown = (index) => {
    const newIsHold = [...isHold];
    newIsHold[index] = true;
    setIsHold(newIsHold);
    holdTimerRef.current[index] = setInterval(() => {
      handleBuyUpgrade(index);
    }, 100);
  };

  const handleMouseUp = (index) => {
    const newIsHold = [...isHold];
    newIsHold[index] = false;
    setIsHold(newIsHold);
    clearInterval(holdTimerRef.current[index]);
  };

  const handleBuyUpgrade = (index) => {
    const { totalUpgrades } = EpicListData[index];
    const { current } = upgrades[index];
    if (current < totalUpgrades) {
      const newUpgrades = [...upgrades];
      newUpgrades[index].current += 1;
      setUpgrades(newUpgrades);
    }
  };

  useEffect(() => {
    return () => {
      holdTimerRef.current.forEach((timer) => clearInterval(timer));
    };
  }, []);

  return (
    <div className="upgrade-list epic">
      {EpicListData.map((upgrade, index) => (
        <div key={index} className="upgrade-item">
          <div className="upgrade-left">
            <img
              src={upgrade.img}
              alt={upgrade.name}
              className="upgrade-image"
            />
            <div
              className={`upgrade-quantity epic ${
                upgrades[index].current === 0 ? "upgrade-quantity--zero" : ""
              }`}
            >
              <span>x</span> {upgrades[index].current}
            </div>
          </div>
          <div className="upgrade-info">
            <h3 className="upgrade-name">{upgrade.name}</h3>
            <p className="upgrade-desc">{formatDescription(upgrade.desc)}</p>
            <div className="progress-bar-container">
              <div className="progress-bar-background">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      (upgrades[index].current /
                        parseInt(upgrade.totalUpgrades)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span className="progression epic">
                {upgrades[index].current} / {upgrade.totalUpgrades}
              </span>
            </div>
          </div>
          {upgrades[index].current < parseInt(upgrade.totalUpgrades) ? (
            <div
              className="upgrade-price epic"
              onMouseDown={() => handleMouseDown(index)}
              onMouseUp={() => handleMouseUp(index)}
              onMouseLeave={() => handleMouseUp(index)}
              onClick={() => handleBuyUpgrade(index)}
            >
              <span>Research</span>
              <div className="upgrade-price-container">
                <img
                  src="../../public/assets/Eggs/GoldenEgg.png"
                  alt="Money"
                  className="upgrade-price-logo epic"
                />
                {formatNumberWithSuffix(getCurrentPrice(index))}
              </div>
            </div>
          ) : (
            <div className="upgrade-completed">
              <div className="complete-square">
                <span>✔</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EpicList;
