// ChatTemp.jsx (final)
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Monitor,
  Smartphone,
  Share2,
  Send,
  RefreshCw,
  Code,
  Eye,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  User,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectProvider } from "../../hooks/useProjectProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { Spinner } from "../ui/spinner";

// <-- shadcn resizable imports -->
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

/**
 * Final ChatTemp.jsx
 * - Desktop: two panels (Chat 35% | Preview/Code 65%) resizable via ResizablePanelGroup
 * - Mobile: stacked layout (Chat or Preview) preserved
 * - Chat area scrolls only inside chat container
 * - divider default 35% and persisted to localStorage
 * - Right panel contains Preview / Code toggle, device switch, refresh, version select, view button
 * - Code view shows a simple file tree + code viewer area
 */

const FolderTree = ({ onSelectFile, selectedFile }) => {
  const [open, setOpen] = useState({
    src: true,
    components: true,
    pages: true,
    ui: true,
  });

  // simple static tree (replace or wire into real files if needed)
  return (
    <div className="text-white font-mono text-sm px-4 py-4 bg-black h-full overflow-auto">
      <div className="space-y-3">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setOpen({ ...open, src: !open.src })}
        >
          {open.src ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <Folder className="w-4 h-4 text-yellow-500" /> <span>src</span>
        </div>

        {open.src && (
          <div className="ml-5 mt-1 border-l border-gray-200 pl-3">
            <div
              className={`flex items-center gap-2 cursor-pointer py-1 px-2 rounded ${
                selectedFile === "app.tsx" ? "bg-gray-100" : "hover:bg-gray-700"
              }`}
              onClick={() => onSelectFile && onSelectFile("app.tsx")}
            >
              <File className="w-4 h-4 text-blue-500" />
              <span>app.tsx</span>
            </div>

            <div className="mt-2">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  setOpen({ ...open, components: !open.components })
                }
              >
                {open.components ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4 text-yellow-500" />
                <span>components</span>
              </div>

              {open.components && (
                <div className="ml-5 mt-1 border-l border-gray-100 pl-3">
                  <div
                    className={`flex items-center gap-2 py-1 px-2 rounded ${
                      selectedFile === "ChatTemp.jsx"
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => onSelectFile && onSelectFile("ChatTemp.jsx")}
                  >
                    <File className="w-4 h-4 text-blue-500" />
                    <span>ChatTemp.jsx</span>
                  </div>

                  <div className="mt-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setOpen({ ...open, pages: !open.pages })}
                    >
                      {open.pages ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <Folder className="w-4 h-4 text-yellow-500" />
                      <span>pages</span>
                    </div>

                    {open.pages && (
                      <div className="ml-5 mt-1 border-l border-gray-100 pl-3">
                        <div
                          className={`flex items-center gap-2 py-1 px-2 rounded ${
                            selectedFile === "interface.ts"
                              ? "bg-gray-700"
                              : "hover:bg-gray-700"
                          }`}
                          onClick={() =>
                            onSelectFile && onSelectFile("interface.ts")
                          }
                        >
                          <File className="w-4 h-4 text-blue-500" />
                          <span>interface.ts</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen({ ...open, ui: !open.ui })}
              >
                {open.ui ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Folder className="w-4 h-4 text-yellow-500" />
                <span>ui</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple code viewer (replace with syntax highlighter if you want)
const CodeViewer = ({ fileName }) => {
  // demo code snippets for the sample file names
  const demoFiles = {
    "ChatTemp.jsx": `// Example: ChatTemp.jsx\n// Replace this string with the real file content or wire your code loader.\nconsole.log("ChatTemp demo file");`,
    "app.tsx": `// Example: app.tsx\nexport default function App() { return <div>Hello</div> }`,
    "interface.ts": `// Example: interface.ts\nexport interface Demo { id: string }`,
    default: `// Select a file from the tree to view its contents.`,
  };

  const content = demoFiles[fileName] || demoFiles.default;

  return (
    <pre className="p-4 text-sm overflow-auto h-full bg-[#0b0b0b] text-[#dfe6ef] font-mono whitespace-pre-wrap">
      {content}
    </pre>
  );
};

const ChatTemp = () => {
  const { id } = useParams();
  const { fetchProjectById, selectedProject, createChat } =
    useProjectProvider();

  // Divider initial: read from localStorage or default to 35 for desktop
  const computeInitialDivider = () => {
    const width = window.innerWidth;
    if (width < 768) return 100; // mobile stacked
    // prefer persisted value if available
    const stored = localStorage.getItem("dividerX");
    return stored ? parseFloat(stored) : 35;
  };

  const [dividerX, setDividerX] = useState(computeInitialDivider);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState("output"); // "output" or "code"
  const [waitingForBot, setWaitingForBot] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deviceView, setDeviceView] = useState("desktop");
  const [selectedVersion, setSelectedVersion] = useState("");

  const [botTexts, setBotTexts] = useState([]);
  const [userTexts, setUserTexts] = useState([]);

  const [mobileView, setMobileView] = useState("chat"); // "chat" or "preview"

  // refs
  const chatContainerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const resizableGroupRef = useRef(null);
  const [finalMessage, setFinalMessages] = useState([]);

  const [fetchGetApi, setFetchGetApi] = useState(false);

  // persist divider on changes (desktop only)
  useEffect(() => {
    const width = window.innerWidth;
    if (width >= 768) localStorage.setItem("dividerX", dividerX);
  }, [dividerX]);

  // fetch project when id changes
  useEffect(() => {
    if (!id) return;
    (async () => {
      const data = await fetchProjectById(id);
      if (!data?.success) return;

      let messages = [];
      if (data.data.chats.length > 0) {
        messages.push({
          sender: "user",
          message: data.data.chats[0].message,
        });
      }

      if (data.data.description) {
        messages.push({
          sender: "bot",
          message: data.data.description,
        });
      }

      if (data.data.chats.length > 1) {
        const remainingChats = data.data.chats.slice(1).map((chat) => chat);
        messages.push(...remainingChats);
      }

      setFinalMessages(messages);

      const botArray = [];
      const userArray = [];

      if (data.data.description) botArray.push(data.data.description);

      const list = Array.isArray(data.data.chats) ? data.data.chats : [];

      list.forEach((item) => {
        if (item.sender === "user") userArray.push(item.message);
        else if (item.sender === "bot") botArray.push(item.message);
      });

      setBotTexts(botArray);
      setUserTexts(userArray);

      if (data.data.versions?.length > 0) {
        setSelectedVersion(data.data.versions[data.data.versions.length - 1]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  console.log(finalMessage, "sdfs");
  // botTexts.forEach((text,index)=>{
  //   console.log("text",text,index);
  // })

  // always scroll chat to bottom when messages change
  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, botTexts, userTexts]);

  const ChatApi = async (params) => {
    const data = await createChat(params);
    if (!data?.success) {
      setWaitingForBot(false);
      setFetchGetApi(false);
      return;
    }
    setWaitingForBot(false);
    setFetchGetApi(false);
    // setRefreshTrigger((p) => p + 1);
    window.location.reload();
    return data;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsg = { sender: "user", text: input };
    setMessages((p) => [...p, newMsg]);
    setInput("");
    setWaitingForBot(true);
    setFetchGetApi(true);
    await ChatApi({ project_id: id, prompt: input });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Responsive handling for switching to mobile layout
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 768) setDividerX(100);
      else setDividerX(parseFloat(localStorage.getItem("dividerX")) || 35);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Monitor left panel changes to update dividerX (keeps value updated when user resizes)
  useEffect(() => {
    const el = leftPanelRef.current;
    if (!el) return;
    let ro = null;
    try {
      ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const parentWidth = entry.target.parentElement
            ? entry.target.parentElement.clientWidth
            : window.innerWidth;
          if (!parentWidth || parentWidth === 0) continue;
          const newPercent = (entry.contentRect.width / parentWidth) * 100;
          // Only update when not mobile
          if (!isMobile) {
            const clamped = Math.max(20, Math.min(80, newPercent));
            setDividerX(clamped);
            localStorage.setItem("dividerX", clamped);
          }
        }
      });
      ro.observe(el);
    } catch (err) {
      // ResizeObserver not supported - ignore
    }
    return () => {
      if (ro && el) ro.unobserve(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPanelRef.current, isMobile]);

  // Code view file selection
  const [selectedFile, setSelectedFile] = useState("ChatTemp.jsx");

  return (
    <div className="min-h-screen flex bg-white text-gray-900 overflow-hidden flex-col md:flex-row">
      {isMobile ? (
        <>
          {/* MOBILE: stacked layout (chat or preview) */}
          {mobileView === "chat" && (
            <div
              className="flex flex-col border-r border-gray-200 bg-white w-full h-[100vh]"
              style={{ height: "100vh" }}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="p-2 text-xl cursor-pointer hover:bg-gray-200 rounded-md transition-all"
                  >
                    <ArrowLeft />
                  </Button>
                  <h1 className="font-semibold text-lg text-gray-800">
                    {selectedProject?.data?.name || "Project Chat"}
                  </h1>
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 md:hidden"
                    onClick={() => setMobileView("preview")}
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </Button>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-5"
              >
                {finalMessage.length > 0 ? (
                  <>
                    {finalMessage.map((text, index) => {
                      return (
                        <>
                          {text?.sender === "bot" ? (
                            <>
                              <div
                                key={index}
                                className="flex items-start gap-2 justify-start"
                              >
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                                    CA
                                  </div>
                                  <span className="text-[10px] text-gray-500 mt-1">
                                    CodeAstra
                                  </span>
                                </div>
                                <div
                                  className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-gray-100 text-gray-800 prose prose-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: text?.message,
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-start gap-2 justify-end">
                                <div className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-black text-white">
                                  {text?.message}
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] text-gray-500 mt-1">
                                    {selectedProject?.data?.user?.full_name}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                <textarea
                  placeholder={
                    waitingForBot ? "Please wait..." : "Type your message..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={waitingForBot}
                  rows={2}
                  className="flex-1 resize-none bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={waitingForBot}
                  className={`${
                    waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
                  } text-white`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {mobileView === "preview" && (
            <div className="relative flex-1 overflow-hidden bg-white h-[100vh]">
              {/* top controls */}
              <div className="absolute top-0 left-0 w-full flex items-center justify-between gap-3 px-3 py-3 bg-white/90 z-20 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileView("chat");
                      setViewMode("code");
                    }}
                  >
                    <ArrowLeft />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setViewMode("output")}
                      className={
                        viewMode === "output"
                          ? "font-semibold border-b-2 border-black"
                          : ""
                      }
                    >
                      <Eye className="w-4 h-4" />{" "}
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setViewMode("code")}
                      className={
                        viewMode === "code"
                          ? "font-semibold border-b-2 border-black"
                          : ""
                      }
                    >
                      <Code className="w-4 h-4" />{" "}
                      <span className="hidden sm:inline">Code</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Monitor
                    className={`w-5 h-5 cursor-pointer ${
                      deviceView === "desktop" ? "text-black" : "text-gray-600"
                    }`}
                    onClick={() => setDeviceView("desktop")}
                  />
                  <Smartphone
                    className={`w-5 h-5 cursor-pointer ${
                      deviceView === "mobile" ? "text-black" : "text-gray-600"
                    }`}
                    onClick={() => setDeviceView("mobile")}
                  />
                  <RefreshCw
                    className="w-5 h-5 cursor-pointer text-gray-600"
                    onClick={() => setRefreshTrigger((p) => p + 1)}
                  />
                </div>
              </div>

              <div className="absolute inset-0 flex items-start justify-center pt-16">
                {viewMode === "output" ? (
                  <>
                    {fetchGetApi && (
                      <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                        <Item variant="muted">
                          <ItemMedia>
                            <Spinner />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>Updating changes...</ItemTitle>
                          </ItemContent>
                        </Item>
                      </div>
                    )}
                    <iframe
                      key={`${refreshTrigger}-${selectedVersion}-${selectedProject?.data?.assigned_domain}`}
                      src={
                        selectedProject?.data?.assigned_domain
                          ? `https://${selectedProject.data.assigned_domain}`
                          : ""
                      }
                      className="border-0"
                      style={{
                        width: deviceView === "mobile" ? "375px" : "100%",
                        height: deviceView === "mobile" ? "667px" : "100%",
                        borderRadius: deviceView === "mobile" ? "16px" : "0",
                        boxShadow:
                          deviceView === "mobile"
                            ? "0 0 10px rgba(0,0,0,0.2)"
                            : "none",
                      }}
                      title="Live Preview"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex">
                    <div className="w-1/3 border-r border-gray-200 h-full">
                      <FolderTree
                        onSelectFile={setSelectedFile}
                        selectedFile={selectedFile}
                      />
                    </div>
                    <div className="flex-1 h-full">
                      <CodeViewer fileName={selectedFile} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        // DESKTOP/TABLET: two-column resizable group
        <ResizablePanelGroup
          direction="horizontal"
          className="flex-1 h-screen"
          ref={resizableGroupRef}
        >
          {/* LEFT CHAT PANEL */}
          <ResizablePanel defaultSize={30}>
            <div
              ref={leftPanelRef}
              className="flex flex-col border-r border-gray-200 bg-white"
              style={{ height: "100vh", minHeight: "100vh" }}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="p-2 text-xl cursor-pointer hover:bg-gray-200 rounded-md transition-all"
                  >
                    <ArrowLeft />
                  </Button>

                  <h1 className="font-semibold text-lg text-gray-800">
                    {selectedProject?.data?.name || "Project Chat"}
                  </h1>
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 md:hidden"
                    onClick={() => setViewMode("output")}
                  >
                    <Eye className="w-4 h-4" /> Preview
                  </Button>
                </div>
              </div>

              {/* Chat messages area — only this scrolls */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-5"
              >
                {finalMessage.length > 0 ? (
                  <>
                    {finalMessage.map((text, index) => {
                      return (
                        <>
                          {text?.sender === "bot" ? (
                            <>
                              <div
                                key={index}
                                className="flex items-start gap-2 justify-start"
                              >
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                                    CA
                                  </div>
                                  <span className="text-[10px] text-gray-500 mt-1">
                                    CodeAstra
                                  </span>
                                </div>
                                <div
                                  className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-gray-100 text-gray-800 prose prose-sm"
                                  dangerouslySetInnerHTML={{
                                    __html: text?.message,
                                  }}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-start gap-2 justify-end">
                                <div className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-black text-white">
                                  {text?.message}
                                </div>
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <span className="text-[10px] text-gray-500 mt-1">
                                    {selectedProject?.data?.user?.full_name}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      );
                    })}
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                <textarea
                  placeholder={
                    waitingForBot ? "Please wait..." : "Type your message..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={waitingForBot}
                  rows={2}
                  className="flex-1 resize-none bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm"
                />
                <Button
                  onClick={handleSend}
                  disabled={waitingForBot}
                  className={`${
                    waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
                  } text-white`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ResizablePanel>

          {/* divider */}
          <ResizableHandle className="bg-gray-200 hover:bg-gray-400 cursor-col-resize" />

          {/* RIGHT PREVIEW/CODE PANEL */}
          <ResizablePanel defaultSize={70}>
            <div
              className="relative flex-1 overflow-hidden bg-white"
              style={{ height: "100vh" }}
            >
              {/* Content */}
              <div className="absolute inset-0 pt-16 flex justify-center items-start bg-white">
                {viewMode === "output" ? (
                  <>
                    {fetchGetApi && (
                      <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                        <Item variant="muted">
                          <ItemMedia>
                            <Spinner />
                          </ItemMedia>
                          <ItemContent>
                            <ItemTitle>Updating changes...</ItemTitle>
                          </ItemContent>
                        </Item>
                      </div>
                    )}

                    <iframe
                      key={`${refreshTrigger}-${selectedVersion}-${selectedProject?.data?.assigned_domain}`}
                      src={
                        selectedProject?.data?.assigned_domain
                          ? `https://${selectedProject.data.assigned_domain}`
                          : ""
                      }
                      className="border-0"
                      style={{
                        width: deviceView === "mobile" ? "375px" : "100%",
                        height: deviceView === "mobile" ? "667px" : "100%",
                        borderRadius: deviceView === "mobile" ? "16px" : "0",
                        boxShadow:
                          deviceView === "mobile"
                            ? "0 0 10px rgba(0,0,0,0.2)"
                            : "none",
                      }}
                      title="Live Preview"
                      onLoad={() => setFetchGetApi(false)}
                    />
                  </>
                ) : (
                  // CODE VIEW: File tree (left) + Code viewer (right)
                  <div className="w-full h-full flex">
                    <div className="w-1/3 border-r border-gray-200 h-full">
                      <FolderTree
                        onSelectFile={setSelectedFile}
                        selectedFile={selectedFile}
                      />
                    </div>
                    <div className="flex-1 h-full">
                      <CodeViewer fileName={selectedFile} />
                    </div>
                  </div>
                )}
              </div>

              {/* TOP CONTROLS */}
              <div className="absolute top-0 left-0 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 py-3 bg-white/90 z-20 border-b border-gray-200">
                {/* Left Section */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Back button - mobile only */}
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode("code")}
                    className="flex items-center gap-2 text-sm md:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>

                  {/* Preview button */}
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode("output")}
                    className={`flex items-center gap-2 text-sm ${
                      viewMode === "output"
                        ? "font-semibold border-b-2 border-black"
                        : ""
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>

                  {/* Code button */}
                  <Button
                    variant="ghost"
                    onClick={() => setViewMode("code")}
                    className={`flex items-center gap-2 text-sm ${
                      viewMode === "code"
                        ? "font-semibold border-b-2 border-black"
                        : ""
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span className="hidden sm:inline">Code</span>
                  </Button>

                  {/* Refresh */}
                  <RefreshCw
                    className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer"
                    onClick={() => setRefreshTrigger((p) => p + 1)}
                  />
                </div>

                {/* Right Section */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {/* Version selector - always visible */}
                  <Select
                    value={selectedVersion}
                    onValueChange={setSelectedVersion}
                  >
                    <SelectTrigger className="!w-[160px] text-sm border-none shadow-none focus-visible:ring-0">
                      <SelectValue placeholder="Version" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProject?.data?.versions?.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Icons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Monitor + Smartphone - only md+ */}
                    <Monitor
                      className={`hidden md:inline-block w-5 h-5 cursor-pointer ${
                        deviceView === "desktop"
                          ? "text-black"
                          : "text-gray-600 hover:text-black"
                      }`}
                      onClick={() => setDeviceView("desktop")}
                    />
                    <Smartphone
                      className={`hidden md:inline-block w-5 h-5 cursor-pointer ${
                        deviceView === "mobile"
                          ? "text-black"
                          : "text-gray-600 hover:text-black"
                      }`}
                      onClick={() => setDeviceView("mobile")}
                    />

                    {/* Share - always visible */}
                    <Share2 className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />

                    {/* View button - always visible if domain exists */}
                    {selectedProject?.data?.assigned_domain && (
                      <a
                        href={`https://${selectedProject.data.assigned_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-black hover:bg-gray-900 text-white text-xs md:text-sm px-3 py-2">
                          View
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default ChatTemp;
