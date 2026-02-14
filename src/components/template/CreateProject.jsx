import React from 'react'
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useProjectProvider } from '@/hooks/useProjectProvider';
import { Eye } from 'lucide-react';
import { Send } from 'lucide-react';
import { Code } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Monitor } from 'lucide-react';
import { Smartphone } from 'lucide-react';
import { User } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { socket } from '@/socket/socket';
import UpdatingLobbyOverlay from '@/utils/UpdatingLobbyOverlay';
import { useLocation } from "react-router-dom";
import { TextShimmer } from '../ui/text-shimmer';


const CreateProject = () => {
    const { id } = useParams();
    // CHAT STATES
    const [input, setInput] = useState("");
    const [waitingForBot, setWaitingForBot] = useState(false);

    const computeInitialDivider = () => {
        const width = window.innerWidth;
        if (width < 768) return 100; // mobile stacked
        // prefer persisted value if available
        const stored = localStorage.getItem("dividerX");
        return stored ? parseFloat(stored) : 35;
    };
    const [dividerX, setDividerX] = useState(computeInitialDivider);

    const [mobileView, setMobileView] = useState("chat");
    const [projectStatus, setProjectStatus] = useState(null);
    const [projectDomain, setProjectDomain] = useState(null);
    const [projectName, setProjectName] = useState(null);
    const [codeReady, setCodeReady] = useState(false);
    const [viewMode, setViewMode] = useState("output");
    const [deviceView, setDeviceView] = useState("desktop");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedVersion, setSelectedVersion] = useState("v1");
    const [selectedFile, setSelectedFile] = useState(null);
    const [finalMessage, setFinalMessages] = useState([]);
    const leftPanelRef = useRef(null);
    const resizableGroupRef = useRef(null);
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const botMessageIndexRef = useRef(null);

    const [fetchGetApi, setFetchGetApi] = useState(false);

    const navigate = useNavigate();

    const {
        selectedProject,
        fetchProjectFiles,
        projectFiles,
        fileContent
    } = useProjectProvider();

    console.log("checking the domain : ", selectedProject);




    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         window.history.replaceState(null, "", "/chatpage/829");
    //     }, 5000);

    //     return () => clearTimeout(timer);
    // }, []);


    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!input.trim() || waitingForBot) return;

        setFinalMessages(prev => [
            ...prev,
            { sender: "user", message: input }
        ]);

        setWaitingForBot(true);   // 🔥 Loader starts here
        setInput("");
    };



    const getLanguageFromFile = (path) => {
        if (!path || typeof path !== "string") return "plaintext";

        if (path.endsWith(".js") || path.endsWith(".jsx")) return "javascript";
        if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
        if (path.endsWith(".json")) return "json";
        if (path.endsWith(".html")) return "html";
        if (path.endsWith(".css")) return "css";
        if (path.endsWith(".md")) return "markdown";

        return "plaintext";
    };


    const decodeEscapedContent = (content = "") => {
        try {
            return content
                .replace(/\\u003C/g, "<")
                .replace(/\\u003E/g, ">")
                .replace(/\\"/g, '"')
                .replace(/\\n/g, "\n");
        } catch {
            return content;
        }
    };



    const CodeViewer = ({ filePath, fileContent }) => {
        return (
            <Editor
                height="100%"
                theme="vs-dark"
                language={getLanguageFromFile(filePath)}
                value={decodeEscapedContent(fileContent)}
                options={{
                    readOnly: true,
                    fontSize: 14,
                    lineHeight: 24,
                    lineNumbers: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    insertSpaces: true,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        );
    };




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



    const location = useLocation();

    const initialPrompt = location.state?.initialPrompt;

    useEffect(() => {
        if (initialPrompt) {
            setFinalMessages(prev => {
                const updated = [
                    { sender: "user", message: initialPrompt },
                    { sender: "bot", message: "thinking...",textType:"shimmer" }
                ];

                // Store bot index
                botMessageIndexRef.current = 1;

                return updated;
            });

            setWaitingForBot(true);
            setFetchGetApi(true);
        }
    }, [initialPrompt]);
    ;








    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [finalMessage]);




    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const handleStatus = (data) => {
            console.log("📡 Status:", data);

            setProjectStatus(data.status);

            if (data?.data?.name) {
                setProjectName(data.data.name);
            }

            setFinalMessages(prev => {
                const updated = [...prev];

                if (botMessageIndexRef.current !== null) {

                    if (data.message === "identity_generated") {
                        console.log("checking if condition for data : ", data?.data?.description);

                        updated[botMessageIndexRef.current] = {
                            sender: "bot",
                            message: data?.data?.description
                        };
                    }
                }

                return updated;
            });
        };


        const handleCreated = (data) => {
            console.log("🎉 Project created:", data);

            const createdProject = data?.project;

            if (createdProject?.assigned_domain) {
                setProjectDomain(createdProject.assigned_domain);
            }

            setWaitingForBot(false);
            setCodeReady(true);
            setViewMode("output");   // 👈 show preview directly

            botMessageIndexRef.current = null;
        };



        // 🔥 Remove old listeners first (VERY IMPORTANT)
        socket.off("project_status", handleStatus);
        socket.off("project_created", handleCreated);

        // Attach listeners
        socket.on("project_status", handleStatus);
        socket.on("project_created", handleCreated);

        return () => {
            socket.off("project_status", handleStatus);
            socket.off("project_created", handleCreated);
        };
    }, []);
    ;
    ;


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
                                        onClick={() => navigate("/mainpagescreen")}
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
                                                                {/* <div
                                                                    className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-gray-100 text-gray-800 prose prose-sm"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: text?.message,
                                                                    }}
                                                                /> */}

                                                                <TextShimmer className="p-3 rounded-lg text-sm shadow max-w-[80%]  text-gray-800 prose prose-sm" duration={1}>
                                                                    {text?.message}
                                                                </TextShimmer>
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
                                        <div ref={chatEndRef}></div>
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
                                    className={`${waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
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

                                        {codeReady && (
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
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Monitor
                                        className={`w-5 h-5 cursor-pointer hidden  sm:hidden  ${deviceView === "desktop" ? "text-black" : "text-gray-600"
                                            }`}
                                        onClick={() => setDeviceView("desktop")}
                                    />
                                    <Smartphone
                                        className={`w-5 h-5 cursor-pointer hidden  sm:hidden  ${deviceView === "mobile" ? "text-black" : "text-gray-600"
                                            }`}
                                        onClick={() => setDeviceView("mobile")}
                                    />
                                    <RefreshCw
                                        className="w-5 h-5 cursor-pointer text-gray-600 hidden  sm:hidden "
                                        onClick={() => setRefreshTrigger((p) => p + 1)}
                                    />

                                    {/* View button - added for mobile */}
                                    <Select
                                        value={selectedVersion}
                                        onValueChange={setSelectedVersion}
                                        className=" sm:block"
                                    >
                                        <SelectTrigger className="   !w-[90px] text-sm border-none shadow-none focus-visible:ring-0 ">
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
                                    {/* <Share2 className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" /> */}
                                    {selectedProject?.data?.assigned_domain && (
                                        <a
                                            href={`https://${selectedProject.data.assigned_domain}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button className="bg-black hover:bg-gray-900 text-white text-xs px-3 py-2">
                                                View
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="absolute inset-0 flex items-start justify-center pt-16">
                                {viewMode === "output" || !codeReady ? (
                                    <>
                                        {waitingForBot && (
                                            <UpdatingLobbyOverlay visible={true} />
                                        )}

                                        {projectDomain && (
                                            <iframe
                                                key={`${refreshTrigger}-${selectedVersion}-${projectDomain}`}
                                                src={`https://${projectDomain}`}
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
                                        )}

                                    </>
                                ) : (

                                    <div className="w-full h-full flex">
                                        <div className="w-1/3 border-r border-gray-200 h-full bg-black">
                                            {projectFiles.loading ? (
                                                // 🔄 Loading state
                                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                                    <Spinner />
                                                    <span className="text-sm">
                                                        Loading project files…
                                                    </span>
                                                </div>
                                            ) : projectFiles.error ? (
                                                // ❌ Error state
                                                <div className="h-full flex flex-col items-center justify-center text-red-400 px-4 text-center">
                                                    <p className="text-sm font-medium">
                                                        Failed to load files
                                                    </p>
                                                    <p className="text-xs mt-1 opacity-80">
                                                        {projectFiles.error}
                                                    </p>

                                                    <Button
                                                        size="sm"
                                                        className="mt-3 bg-gray-800 hover:bg-gray-700 text-white"
                                                        onClick={() => fetchProjectFiles("v1", id)}
                                                    >
                                                        Retry
                                                    </Button>
                                                </div>
                                            ) : projectFiles.files.length === 0 ? (
                                                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                                    No files found
                                                </div>
                                            ) : (
                                                // ✅ Success state
                                                <FolderTree
                                                    files={projectFiles.files}
                                                    onSelectFile={handleSelectFile}
                                                    selectedFile={selectedFile}
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 h-full">
                                            <CodeViewer
                                                filePath={selectedFile}
                                                fileContent={fileContent}
                                            />

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
                                        onClick={() => navigate("/mainpagescreen")}
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
                                                                {/* <div
                                                                    className="rounded-lg text-sm shadow max-w-[80%] bg-gray-100 text-gray-800 prose prose-sm p-5"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: text?.message,
                                                                    }}
                                                                /> */}

                                                                {
                                                                    text?.textType == "shimmer" && (
                                                             <TextShimmer className="p-3 rounded-lg text-sm max-w-[80%] bg-transparent prose prose-sm" duration={1}>
                                                                    {text?.message}
                                                                </TextShimmer>
                                                                    )
                                                                }

                                                                {
                                                                    text?.textType != "shimmer" && (
                                                                        <TextShimmer className="p-3 rounded-lg text-sm shadow max-w-[80%]  text-gray-800 prose prose-sm" duration={1}>
                                                                    {text?.message}
                                                                </TextShimmer>
                                                                    )
                                                                }
                                                                
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-start gap-2 justify-end">
                                                                <div className="rounded-lg text-sm shadow max-w-[80%] bg-black text-white p-3">
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
                                        <div ref={chatEndRef}></div>
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
                                    className={`${waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
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
                                {viewMode === "output" || !codeReady ? (
                                    <>
                                        {waitingForBot && (
                                            <UpdatingLobbyOverlay visible={true} />
                                        )}

                                        {projectDomain && (
                                            <iframe
                                                key={`${refreshTrigger}-${selectedVersion}-${projectDomain}`}
                                                src={`https://${projectDomain}`}
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
                                        )}

                                    </>
                                ) : (

                                    // CODE VIEW: File tree (left) + Code viewer (right)
                                    <div className="w-full h-full flex">
                                        <div className="w-1/3 border-r border-gray-200 h-full bg-black">
                                            {projectFiles.loading ? (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                                    <Spinner />
                                                    <span className="text-sm">
                                                        Loading project files…
                                                    </span>
                                                </div>
                                            ) : projectFiles.error ? (
                                                <div className="h-full flex flex-col items-center justify-center text-red-400 px-4 text-center">
                                                    <p className="text-sm font-medium">
                                                        Failed to load files
                                                    </p>
                                                    <p className="text-xs mt-1 opacity-80">
                                                        {projectFiles.error}
                                                    </p>

                                                    <Button
                                                        size="sm"
                                                        className="mt-3 bg-gray-800 hover:bg-gray-700 text-white"
                                                        onClick={() => fetchProjectFiles("v1", id)}
                                                    >
                                                        Retry
                                                    </Button>
                                                </div>
                                            ) : projectFiles.files.length === 0 ? (
                                                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                                    No files found
                                                </div>
                                            ) : (
                                                <FolderTree
                                                    files={projectFiles.files}
                                                    onSelectFile={handleSelectFile}
                                                    selectedFile={selectedFile}
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 h-full">
                                            <CodeViewer
                                                filePath={selectedFile}
                                                fileContent={fileContent}
                                            />

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
                                        onClick={() => {
                                            setMobileView("chat");
                                            setViewMode("code");
                                        }}
                                    >
                                        <ArrowLeft />
                                    </Button>


                                    {/* Preview button */}
                                    <Button
                                        variant="ghost"
                                        onClick={() => setViewMode("output")}
                                        className={`flex items-center gap-2 text-sm ${viewMode === "output"
                                            ? "font-semibold border-b-2 border-black"
                                            : ""
                                            }`}
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span className="hidden sm:inline">Preview</span>
                                    </Button>

                                    {/* Code button */}
                                    {codeReady && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setViewMode("code")}
                                            className={`flex items-center gap-2 text-sm ${viewMode === "code"
                                                ? "font-semibold border-b-2 border-black"
                                                : ""
                                                }`}
                                        >
                                            <Code className="w-4 h-4" />
                                            <span className="hidden sm:inline">Code</span>
                                        </Button>
                                    )}

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
                                        className=" sm:block"
                                    >
                                        <SelectTrigger className="   !w-[160px] text-sm border-none shadow-none focus-visible:ring-0 ">
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
                                            className={`hidden md:inline-block w-5 h-5 cursor-pointer sm:hidden  ${deviceView === "desktop"
                                                ? "text-black"
                                                : "text-gray-600 hover:text-black"
                                                }`}
                                            onClick={() => setDeviceView("desktop")}
                                        />
                                        <Smartphone
                                            className={`hidden md:inline-block w-5 h-5 cursor-pointer ${deviceView === "mobile"
                                                ? "text-black"
                                                : "text-gray-600 hover:text-black"
                                                }`}
                                            onClick={() => setDeviceView("mobile")}
                                        />

                                        {/* Share - always visible */}
                                        {/* <Share2 className="w-5 h-5 text-gray-600 hover:text-black cursor-pointer" /> */}

                                        {/* View button - always visible if domain exists */}
                                        {selectedProject?.data?.assigned_domain && (
                                            <a
                                                href={`https://${selectedProject.data.assigned_domain}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Button className="bg-black hover:bg-gray-900 text-white  text-xs md:text-sm px-3 py-2">
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
    )
}

export default CreateProject