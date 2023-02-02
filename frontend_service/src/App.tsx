import { Button } from "@mui/material";
import React, { useState } from "react";
// @ts-ignore
import { useSpeechSynthesis } from "react-speech-kit";
import "./App.css";
import Dictaphone1 from "./Dic";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Slider from "@mui/material/Slider";
import alanBtn from "@alan-ai/alan-sdk-web";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

function Example() {
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const [blogs, setBlogs] = React.useState([]);
  const [value, setValue] = React.useState("1");
  const [fontVal, setFontVal] = React.useState<number>(0);
  const [selectedBlog, setSelectedBlog] = React.useState(null);
  const [parsedBlog, setParsedBlog] = React.useState<string[]>([]);
  const [tts, setTts] = React.useState(false);
  const [shouldSendRequest, setShouldSendRequest] = React.useState(false);
  const [summaries, setSummaries] = React.useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getSummaries = async () => {
    const res = await axios.get(`http://23.88.117.114/api/summaries`);

    setSummaries(res.data);
  };

  const getBlog = React.useCallback(async (id: string) => {
    const res = await axios.get(`http://23.88.117.114/api/posts/${id}`);
    setSelectedBlog(res.data);
    setParsedBlog(res.data.text.match(/[^\.!\?]+[\.!\?]+/g));
  }, []);

  const clear = React.useCallback(() => {
    parsedBlog.forEach((val, index) => {
      const p = document.getElementById(`index-${index}`);
      if (!p?.style) return;
      // @ts-ignore
      console.log("found");
      p.style.backgroundColor = "#B1D4E0";
    });
  }, [parsedBlog]);

  React.useEffect(() => {
    if (!speaking) {
      clear();
    }
  }, [speaking]);

  const getBlogs = React.useCallback(async () => {
    const res = await axios.get(
      "http://23.88.117.114/api/posts?limit=10&offset=30"
    );

    setBlogs(res.data);
    getBlog(res.data[0].id);
  }, [getBlog]);

  const getSummary = React.useCallback(async () => {
    console.log("asdas");
    const res = await axios.post("http://23.88.117.114/api/summaries", {
      html: (selectedBlog as any).text || "",
    });
    alert(res.data.summary);
  }, [selectedBlog]);

  React.useEffect(() => {
    if (shouldSendRequest) {
      getSummary();
    }
    setTimeout(() => {
      setShouldSendRequest(false);
    }, 2000);
  }, [shouldSendRequest, getSummary]);

  React.useEffect(() => {
    if (blogs.length === 0) getBlogs();
    getSummaries();
    alanBtn({
      key: "156317fdc4a8f623dfc0cfe035353be02e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        console.log(commandData);
        //@ts-ignore
        if (commandData.command === "go:back") {
          console.log("go:back");
        }
      },
      onEvent: function (e) {
        //@ts-ignore
        console.log(e.name);
        //@ts-ignore
        if (e.name === "recognized") {
          //@ts-ignore
          console.log(e.text, "here");
          //@ts-ignore
          if (e.text === "get summary") {
            console.log("here there");
            if (shouldSendRequest === false) setShouldSendRequest(true);
          }
          //@ts-ignore
          if (e.text === "font size up") {
            console.log("propro");
            setFontVal((prev) => {
              // @ts-ignore
              document.getElementsByTagName(
                "html"
              )[0].style.fontSize = `${Number(16 + prev + 1)}px`;
              return prev + 1;
            });
          }

          //@ts-ignore
          if (e.text === "font size down") {
            console.log("opropr");
            setFontVal((prev) => {
              // @ts-ignore
              document.getElementsByTagName(
                "html"
              )[0].style.fontSize = `${Number(16 + prev - 1)}px`;
              return prev - 1;
            });
          }
          // @ts-ignore
          if (e.text === "reset font size") {
            console.log("opropr");
            setFontVal(0);
            document.getElementsByTagName("html")[0].style.fontSize = `${Number(
              16
            )}px`;
          }

          // @ts-ignore
          if (e.text === "turn on assistant") {
            setTts(true);
          }

          // @ts-ignore
          if (e.text === "turn off assistant") {
            setTts(false);
          }
        }
      },
    });
  }, []);

  function valuetext(value: number) {
    return `${value}px`;
  }

  const changeFontSize = React.useCallback((val: number | number[]) => {
    // const p = document.getElementsByTagName('p')

    // @ts-ignore
    if (typeof val === "number") {
      setFontVal(val);
      // @ts-ignore
      document.getElementsByTagName("html")[0].style.fontSize = `${Number(
        16 + val
      )}px`;
    }
  }, []);

  const handleTts = React.useCallback(
    (index: number) => {
      cancel();

      clear();
      const p = document.getElementById(`index-${index}`);
      if (!p?.style) return;
      // @ts-ignore
      p.style.backgroundColor = "yellow";
      console.log(p?.innerText);
      speak({ text: p?.innerText });
      console.log("finish");
    },
    [cancel, clear, speak]
  );

  React.useEffect(() => {
    console.log("speaking", speaking);
  }, [speaking]);

  // <button onClick={() => speak({ text: text })}>Speak</button>;

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Blogs" value="1" />
            <Tab label="Summaries" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="wrapper">
            <div className="blogs-list">
              {blogs.map((blog) => (
                <p
                  className="blog-link"
                  onClick={() => getBlog((blog as any).id)}
                >
                  {/*@ts-ignore */}
                  {blog.brief}
                </p>
              ))}
            </div>
            <div className="blog-container">
              <div className="blog">
                {selectedBlog && (
                  <>
                    {/*@ts-ignore */}
                    <p className="blog-topic">{selectedBlog.topic}</p>
                    {parsedBlog.map((sentence, index) => (
                      <p
                        id={`index-${index}`}
                        className="blog-body-text"
                        onClick={() => handleTts(index)}
                      >
                        {sentence}
                      </p>
                    ))}
                    <div className="author-container">
                      {/*@ts-ignore */}
                      <p className="blog-creds">{selectedBlog.sign}</p>
                      {/*@ts-ignore */}
                      <p className="blog-creds">{selectedBlog.date}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="blog-controls">
                {/* <Button
                  variant="contained"
                  className="summary-btn"
                  color="success"
                >
                  Get summary
                </Button> */}

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tts}
                        onChange={(e, val) => {
                          setTts(val);
                          if (!val) clear();
                        }}
                        color="secondary"
                      />
                    }
                    label="TTS"
                  />
                </FormGroup>
                <p>Font size:</p>

                <Slider
                  aria-label="Temperature"
                  defaultValue={0}
                  getAriaValueText={valuetext}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={-5}
                  max={5}
                  color="secondary"
                  value={fontVal}
                  onChange={(_, value) => changeFontSize(value)}
                />

                {tts && (
                  <div>
                    {speaking && (
                      <video width="300" height="240" loop muted autoPlay>
                        <source
                          src="https://d2rr9zb23dsy2d.cloudfront.net/talk2.webm"
                          type="video/webm"
                        />
                      </video>
                    )}

                    {!speaking && (
                      <video width="300" height="240" loop muted autoPlay>
                        <source
                          src="https://d2rr9zb23dsy2d.cloudfront.net/idle.webm"
                          type="video/webm"
                        />
                      </video>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div className="summary-wrapper">
            {summaries.map((sum) => (
              <div className="summary-wr">
                {/*@ts-ignore */}
                <a href={sum.url} target="_blank" className="url-sum">
                  {/*@ts-ignore */}
                  {sum.url}
                </a>
                {/*@ts-ignore */}
                <p className="summary-text">{sum.summary}</p>
              </div>
            ))}
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Example;
