import { useEffect, useRef, useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import "./solutions.css";
import { getVersion } from '@tauri-apps/api/app';
import { findMatchesSortedUniqueLetters } from "./helpers/findMatches"
import { IWordsGroupedByLength, groupWordsByLength } from "./helpers/groupWordsByLength";
import PalmTreeImage from "./assets/PalmTree.png";
import CloudImage from "./assets/Clouds.png";
import DarkWaterImage from "./assets/DarkWater.png";
import LightWaterImage from "./assets/LightWater.png";

interface ILettersInputSectionProps {
  letters: string;
  onNewLetters: (newLetters: string) => void;
}

function LettersInputSection({ letters, onNewLetters }: ILettersInputSectionProps) {
  const inputRef = useRef<null | HTMLInputElement>(null);

  const onTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const letters = value.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (letters.length <= 7) {
      onNewLetters(letters);
    }
  }

  function onClear() {
    onNewLetters("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div className="letters--section">
      <div className="letters-inputandlabel">
        <label className="letters--input--label" htmlFor="lettersinput">Type in the box</label>
        <div className="letters--both-buttons">
          <input id="lettersinput" className="letters--input" type="text" value={letters} onChange={onTyping} ref={inputRef} />
          <button className="letters--button--clear" onClick={onClear}>CLEAR</button>
        </div>
      </div>
      <img className="cloudimage" src={CloudImage} alt="" />
      <div className="darkwater" style={{ backgroundImage: `url(${DarkWaterImage})` }}></div>
      <img className="palmtreeimage" src={PalmTreeImage} alt="" />
      <div className="lightwater" style={{ backgroundImage: `url(${LightWaterImage})` }}></div>
    </div>
  )
}

function SolutionsSection({ words, appVersion }: { solvedFor: string, words: null | IWordsGroupedByLength, appVersion: string }) {
  return (
    <div className="solutions--section">
      <div className="solutions--allcards">
      {
        (typeof words === "object" && words !== null) ? Object.keys(words).map((key: string) => {
          const wordsForLength = words[key as keyof IWordsGroupedByLength];
          return wordsForLength ? (
            <div className="solution" key={`card-${key}`}>
              <div className="solution--card">
                <h3 className="solution--title">{key} letters</h3>
                <ul className="solution--list">
                  {wordsForLength.map((word: string) => (
                    <li className="solution--item" key={`word-${key}-${word}`}>{word}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null
        }) : null
      }
      </div>
      <div className="appversion">v:{appVersion}</div>
    </div>
  )
}

function App() {
  const [letters, setLetters] = useState("");
  const [solvedFor, setSolvedFor] = useState("");
  const [words, setWords] = useState<null | IWordsGroupedByLength>(null);
  const [appVersion, setAppVersion] = useState("-");

  async function getAppVersion() {
    try {
      const _appVersion = await getVersion();
      setAppVersion(_appVersion ?? "?!");
    } catch (ex) {
      console.log('ERROR!', ex);
    }
  }

  useEffect(() => {
    getAppVersion();
  }, [])

  async function solveForLetters(newLetters: string) {
    const matches = findMatchesSortedUniqueLetters(
      newLetters
    )

    if (matches.length > 0) {
      const groupedByLength = groupWordsByLength(matches);
      setWords(groupedByLength);
    } else {
      setWords(null);
    }
  }

  const onNewLetters = (newLetters: string) => {
    setLetters(newLetters);

    if (newLetters.length >= 4) {
      setSolvedFor(newLetters);
      solveForLetters(newLetters);
    }
  }

  // async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <div className="app--container">
      <LettersInputSection letters={letters} onNewLetters={onNewLetters} />
      <SolutionsSection solvedFor={solvedFor} words={words} appVersion={appVersion} />
    </div>
  );
}

export default App;
