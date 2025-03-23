import { createContext } from "react";
import runChat from "../config/gemini";
import { useState } from "react";

export const Context = createContext();
const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompt, setPrvPrompt ] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, next) => {
        setTimeout(function() {
            setResultData(prev => prev+next)
        },75*index)
    }
    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        
        setResultData("");
        setLoading(true);
        setShowResult(true)

        let response;
        if(prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        } else {
            setPrvPrompt(prev => [...prev, input])
            setRecentPrompt(input)
            response = await runChat(input)
        }

       let responseArray = response.split("**");
       let newResponse = "";

       for(let i=0 ; i<responseArray.length ; i++) {
        if(i === 0 || i%2 !== 1) {
            newResponse += responseArray[i];
        } else {
            newResponse += "<b>"+responseArray[i]+"</b>";
        }
       }
       let newResponse2 = newResponse.split("*").join('<br>');

       let newResponseArr = newResponse2.split(" ");
       for(let i=0 ; i<newResponseArr.length ; i++) {
        const next = newResponseArr[i];
        delayPara(i,next+" ");
       }
       setLoading(false);
       setInput("");

    }

    const contextValue = {
        prevPrompt,
        setPrvPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return (
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider;