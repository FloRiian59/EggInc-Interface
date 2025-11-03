/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import CommonListData from "../data/CommonListData";
import "../css/CommonList.css";

const formatDescription = (desc) => {
  const highlightRegex =
    /(\+\d+\.\d+%|\d+\.\d+%|\d+%|\d+\.\d+x|\d+x|\d{2,3}|\bTRIPLES\b|\bDOUBLES\b|\d)/g;
  const formattedDesc = desc.replace(
    highlightRegex,
    (match) => `<span class="highlight">${match}</span>`
  );
  return <span dangerouslySetInnerHTML={{ __html: formattedDesc }} />;
};

const formatNumberWithSuffix = (num) => {
  const suffixes = [
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" }, // million
    { value: 1e9, symbol: "B" }, // billion
    { value: 1e12, symbol: "T" }, // trillion
    { value: 1e15, symbol: "q" }, // quadrillion
    { value: 1e18, symbol: "Q" }, // quintillion
    { value: 1e21, symbol: "s" }, // sextillion
    { value: 1e24, symbol: "S" }, // septillion
    { value: 1e27, symbol: "o" }, // octillion
    { value: 1e30, symbol: "N" }, // nonillion
    { value: 1e33, symbol: "D" }, // decillion
    { value: 1e36, symbol: "U" }, // undecillion
    { value: 1e39, symbol: "Td" }, // duodecillion
    { value: 1e42, symbol: "Qd" }, // tredecillion
    { value: 1e45, symbol: "sd" }, // quattuordecillion
    { value: 1e48, symbol: "uV" }, // quindecillion
    { value: 1e51, symbol: "Sd" }, // sexdecillion
    { value: 1e54, symbol: "Od" }, // septendecillion
    { value: 1e57, symbol: "Nd" }, // octodecillion
    { value: 1e60, symbol: "V" }, // vigintillion
  ];

  for (let i = suffixes.length - 1; i >= 0; i--) {
    if (num >= suffixes[i].value) {
      return (
        (num / suffixes[i].value).toFixed(2).replace(/\.?0+$/, "") +
        suffixes[i].symbol
      );
    }
  }
  return num.toFixed(2);
};

const CommonList = () => {
  const [upgrades, setUpgrades] = useState(
    CommonListData.map(() => ({ current: 0 }))
  );
  const [isHold, setIsHold] = useState(
    Array(CommonListData.length).fill(false)
  );
  const holdTimerRef = useRef([]);

  const getCurrentPrice = (index) => {
    const { basePrice } = CommonListData[index];
    const { current } = upgrades[index];
    const ratio = 1.5;
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
    const { totalUpgrades } = CommonListData[index];
    const { current } = upgrades[index];

    if (current < totalUpgrades) {
      const newUpgrades = [...upgrades];
      newUpgrades[index].current += 1;
      setUpgrades(newUpgrades);
    }
  };

  const upgradesByTier = CommonListData.reduce((acc, upgrade) => {
    const tier = upgrade.tier;
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(upgrade);
    return acc;
  }, {});

  useEffect(() => {
    return () => {
      holdTimerRef.current.forEach((timer) => clearInterval(timer));
    };
  }, []);

  return (
    <div className="upgrade-list">
      {/* Boucle sur chaque tier, trié numériquement */}
      {Object.keys(upgradesByTier)
        .map(Number) // Convertit les clés en nombres
        .sort((a, b) => a - b) // Trie par ordre croissant (1, 2, 3, ...)
        .map((tier) => (
          <div key={tier} className="tier-container">
            <h2 className="tier-title">Tier {tier}</h2>
            <ul className="tier-upgrades">
              {/* Boucle sur les upgrades du tier actuel */}
              {upgradesByTier[tier].map((upgrade, upgradeIndex) => {
                const globalIndex = CommonListData.findIndex(
                  (u) => u.name === upgrade.name
                );
                return (
                  <li key={upgradeIndex} className="upgrade-item-li">
                    <div className="upgrade-item">
                      <div className="upgrade-left">
                        <img
                          src={upgrade.img}
                          alt={upgrade.name}
                          className="upgrade-image"
                        />
                        <div
                          className={`upgrade-quantity ${
                            upgrades[globalIndex].current === 0
                              ? "upgrade-quantity--zero"
                              : "upgrade-quantity"
                          }`}
                        >
                          <span>x</span> {upgrades[globalIndex].current}
                        </div>
                      </div>
                      <div className="upgrade-info">
                        <h3 className="upgrade-name">{upgrade.name}</h3>
                        <p className="upgrade-desc">
                          {formatDescription(upgrade.desc)}
                        </p>
                        <div className="progress-bar-container">
                          <div className="progress-bar-background">
                            <div
                              className="progress-bar"
                              style={{
                                width: `${
                                  (upgrades[globalIndex].current /
                                    parseInt(upgrade.totalUpgrades)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="progression">
                            {upgrades[globalIndex].current} /{" "}
                            {upgrade.totalUpgrades}
                          </span>
                        </div>
                      </div>
                      {upgrades[globalIndex].current <
                      parseInt(upgrade.totalUpgrades) ? (
                        <div
                          className="upgrade-price"
                          onMouseDown={() => handleMouseDown(globalIndex)}
                          onMouseUp={() => handleMouseUp(globalIndex)}
                          onMouseLeave={() => handleMouseUp(globalIndex)}
                          onClick={() => handleBuyUpgrade(globalIndex)}
                        >
                          <span>Research</span>
                          <div className="upgrade-price-container">
                            <img
                              src="../../public/assets/Research/Common/Money.png"
                              alt="Money"
                              className="upgrade-price-logo"
                            />
                            {formatNumberWithSuffix(
                              getCurrentPrice(globalIndex)
                            )}
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
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default CommonList;
