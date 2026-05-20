  import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    useCallback,
  } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import {
    Monitor,
    Smartphone,
    Send,
    RefreshCw,
    Eye,
    ChevronRight,
    ChevronDown,
    Folder,
    File,
    User,
    ArrowLeft,
    Container,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { useProjectProvider } from "../../hooks/useProjectProvider";
  import { Spinner } from "../ui/spinner";
  import Editor from "@monaco-editor/react";
  import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import UpdatingLobbyOverlay from "@/utils/UpdatingLobbyOverlay";
  import MarkdownRenderer from "../ui/markdown-renderer";
  import { useAuth } from "@/context/ContextProvider";
  import { socket } from "@/socket/socket";
  import { errorToast, successToast } from "@/components/atoms/Toast.Atom";
  import EnvSection from "../organisms/EnvSection";
  import DatabaseSection from "../organisms/DatabaseSection";
  import { Database } from "lucide-react";
  import { Link } from "lucide-react";
  import DomainSection from "../organisms/DomainSection";
  import { FaBars } from "react-icons/fa";
  import { Settings } from "lucide-react";
  import SettingsSection from "../organisms/SettingsSection";


  const MOBILE_BREAKPOINT = 768;

  const buildFileTree = (files) => {
    const root = {};

    files.forEach(({ name }) => {
      const parts = name.split("/");
      let current = root;

      parts.forEach((part, index) => {
        if (!current[part]) {
          current[part] = {
            __isFile: index === parts.length - 1,
            __children: {},
          };
        }
        current = current[part].__children;
      });
    });

    return root;
  };

  const TreeNode = ({
    nodeName,
    node,
    depth,
    onSelectFile,
    selectedFile,
    fullPath,
  }) => {
    const [open, setOpen] = useState(false);
    const isFile = node.__isFile;
    const isActive = selectedFile === fullPath;

    return (
      <div>
        <div
          className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1 ${isActive ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          style={{ paddingLeft: depth * 14 }}
          onClick={() => {
            if (isFile) {
              onSelectFile(fullPath);
            } else {
              setOpen((prev) => !prev);
            }
          }}
        >
          {!isFile &&
            (open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ))}

          {isFile ? (
            <File className="h-4 w-4 text-blue-400" />
          ) : (
            <Folder className="h-4 w-4 text-yellow-500" />
          )}

          <span className="truncate text-sm">{nodeName}</span>
        </div>

        {!isFile && open && (
          <div className="ml-4">
            {Object.entries(node.__children)
              .sort(([nameA, a], [nameB, b]) => {
                if (a.__isFile !== b.__isFile) {
                  return a.__isFile ? 1 : -1;
                }
                return nameA.localeCompare(nameB);
              })
              .map(([childName, childNode]) => (
                <TreeNode
                  key={`${fullPath}/${childName}`}
                  nodeName={childName}
                  node={childNode}
                  depth={depth + 1}
                  onSelectFile={onSelectFile}
                  selectedFile={selectedFile}
                  fullPath={`${fullPath}/${childName}`}
                />
              ))}
          </div>
        )}
      </div>
    );
  };

  const FolderTree = ({ files, selectedFile, onSelectFile }) => {
    const tree = useMemo(() => buildFileTree(files || []), [files]);

    return (
      <div className="h-full overflow-auto bg-black p-3 font-mono text-sm text-white">
        {Object.entries(tree)
          .sort(([nameA, a], [nameB, b]) => {
            if (a.__isFile !== b.__isFile) {
              return a.__isFile ? 1 : -1;
            }
            return nameA.localeCompare(nameB);
          })
          .map(([name, node]) => (
            <TreeNode
              key={name}
              nodeName={name}
              node={node}
              depth={0}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
              fullPath={name}
            />
          ))}
      </div>
    );
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

  const getLanguageFromFile = (path = "") => {
    if (path.endsWith(".js") || path.endsWith(".jsx")) return "javascript";
    if (path.endsWith(".ts") || path.endsWith(".tsx")) return "typescript";
    if (path.endsWith(".json")) return "json";
    if (path.endsWith(".html")) return "html";
    if (path.endsWith(".css")) return "css";
    if (path.endsWith(".md")) return "markdown";
    return "plaintext";
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

  const ChatMessages = ({
    finalMessage,
    selectedProject,
    chatContainerRef,
    chatEndRef,
  }) => {
    return (
      <div
        ref={chatContainerRef}
        className="flex-1 space-y-5 overflow-y-auto p-6"
      >
        {finalMessage.map((text, index) => {
          const isBot = text?.sender === "bot";

          if (isBot) {
            return (
              <div
                key={`bot-${index}`}
                className="flex items-start justify-start gap-2"
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold">
                    CA
                  </div>
                  <span className="mt-1 text-[10px] text-gray-500">
                    CodeAstra
                  </span>
                </div>

                <div
                  className={`prose prose-sm max-w-[80%] rounded-lg p-3 text-sm shadow ${text?.textType === "shimmer"
                    ? "animate-pulse bg-gray-50 text-gray-600"
                    : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {text?.type === "string" ? (
                    text?.message
                  ) : (
                    <MarkdownRenderer>{text?.message}</MarkdownRenderer>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={`user-${index}`}
              className="flex items-start justify-end gap-2"
            >
              <div className="max-w-[80%] rounded-lg bg-black p-3 text-sm text-white shadow">
                {text?.message}
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  <User className="h-4 w-4" />
                </div>
                <span className="mt-1 text-[10px] text-gray-500">
                  {selectedProject?.data?.user?.full_name || "You"}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
    );
  };

  const ChatPanel = ({
    selectedProject,
    waitingForBot,
    input,
    setInput,
    handleKeyDown,
    handleSend,
    finalMessage,
    chatContainerRef,
    chatEndRef,
    onNavigateHome,
    showPreviewButton,
    onShowPreview,
    setViewMode,
    setMobileView
  }) => {
    return (
      <div className="flex h-screen flex-col border-r border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onNavigateHome}
              className="cursor-pointer rounded-md p-2 text-xl transition-all hover:bg-gray-200"
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-lg font-semibold text-gray-800">
              {selectedProject?.data?.name || "Project Chat"}
            </h1>
          </div>

          {showPreviewButton ? (
            // <Button
            //   variant="outline"
            //   className="flex items-center gap-2"
            //   onClick={onShowPreview}
            // >
            //   <Eye className="h-4 w-4" /> Preview
            // </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FaBars />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-44" align="start">
                <DropdownMenuGroup>

                  {/* ✅ PREVIEW */}
                  <DropdownMenuItem
                    onClick={() => {
                      onShowPreview(); // ye theek hai
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    <span>Preview</span>
                  </DropdownMenuItem>

                  {/* ✅ DATABASE */}
                  <DropdownMenuItem
                    onClick={() => {
                      setViewMode("database");
                      setMobileView("preview"); // 👈 IMPORTANT
                    }}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    <span>Database</span>
                  </DropdownMenuItem>

                  {/* ✅ ENV */}
                  <DropdownMenuItem
                    onClick={() => {
                      setViewMode("env");
                      setMobileView("preview"); // 👈 IMPORTANT
                    }}
                  >
                    <Container className="h-4 w-4 mr-2" />
                    <span>Env's</span>
                  </DropdownMenuItem>

                  {/* ✅ DOMAIN */}
                  <DropdownMenuItem
                    onClick={() => {
                      setViewMode("domain");
                      setMobileView("preview"); // 👈 IMPORTANT
                    }}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    <span>Custom Domain</span>
                  </DropdownMenuItem>

                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>




        <ChatMessages
          finalMessage={finalMessage}
          selectedProject={selectedProject}
          chatContainerRef={chatContainerRef}
          chatEndRef={chatEndRef}
        />

        <div className="flex items-center gap-2 border-t border-gray-200 bg-white p-3">
          <textarea
            placeholder={
              waitingForBot ? "Please wait..." : "Type your message..."
            }
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={waitingForBot}
            rows={2}
            className="flex-1 resize-none rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={waitingForBot || !input.trim()}
            className={`${waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
              } text-white`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const CodeWorkspace = ({
    projectFiles,
    id,
    fetchProjectFiles,
    selectedFile,
    onSelectFile,
    fileContent,
  }) => {
    return (
      <div className="flex h-full w-full">
        <div className="h-full w-1/3 border-r border-gray-200 bg-black">
          {projectFiles.loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
              <Spinner />
              <span className="text-sm">Loading project files...</span>
            </div>
          ) : projectFiles.error ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center text-red-400">
              <p className="text-sm font-medium">Failed to load files</p>
              <p className="mt-1 text-xs opacity-80">{projectFiles.error}</p>
              <Button
                size="sm"
                className="mt-3 bg-gray-800 text-white hover:bg-gray-700"
                onClick={() => fetchProjectFiles("v1", id)}
              >
                Retry
              </Button>
            </div>
          ) : projectFiles.files.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">
              No files found
            </div>
          ) : (
            <FolderTree
              files={projectFiles.files}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
            />
          )}
        </div>

        <div className="h-full flex-1">
          <CodeViewer filePath={selectedFile} fileContent={fileContent} />
        </div>
      </div>
    );
  };

  const PreviewPanel = ({
    isMobile,
    onBackToChat,
    viewMode,
    setViewMode,
    deviceView,
    setDeviceView,
    refreshTrigger,
    setRefreshTrigger,
    selectedVersion,
    selectedProject,
    waitingForBot,
    projectStatus,
    projectFiles,
    selectedFile,
    onSelectFile,
    fetchProjectFiles,
    id,
    fileContent,
    current_domain: currentDomain,
  }) => {
    const previewUrl = selectedProject?.data?.assigned_domain || null;
    const mobileFrame = !isMobile && deviceView === "mobile";

    return (
      <div className="relative h-screen flex-1 overflow-hidden bg-white">
        <div className="absolute left-0 top-0 z-20 flex w-full flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white/90 px-4 py-3">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <Button variant="ghost" onClick={onBackToChat} className="p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : null}

            <Button
              variant="ghost"
              onClick={() => setViewMode("output")}
              className={`flex cursor-pointer items-center gap-2 text-sm ${viewMode === "output"
                ? "border-b-2 border-black font-semibold"
                : ""
                }`}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setViewMode("database")}
              className={`flex cursor-pointer items-center gap-2 text-sm ${viewMode === "database" ? "border-b-2 border-black font-semibold" : ""
                }`}
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Database</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setViewMode("env")}
              className={`flex cursor-pointer items-center gap-2 text-sm ${viewMode === "env" ? "border-b-2 border-black font-semibold" : ""
                }`}
            >
              <Container className="h-4 w-4" />
              <span className="hidden sm:inline">Env's</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => setViewMode("domain")}
              className={`flex cursor-pointer items-center gap-2 text-sm ${viewMode === "domain" ? "border-b-2 border-black font-semibold" : ""
                }`}
            >
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">Custom Domain</span>
            </Button>



            <Button
              variant="ghost"
              onClick={() => setViewMode("settings")}
              className={`flex cursor-pointer items-center gap-2 text-sm ${viewMode === "settings" ? "border-b-2 border-black font-semibold" : ""
                }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>


            <RefreshCw
              className="h-5 w-5 cursor-pointer text-gray-600 hover:text-black"
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
            />
          </div>

          <div className="flex items-center gap-3">
            {!isMobile ? (
              <>
                <Monitor
                  className={`h-5 w-5 cursor-pointer ${deviceView === "desktop"
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                    }`}
                  onClick={() => setDeviceView("desktop")}
                />
                <Smartphone
                  className={`h-5 w-5 cursor-pointer ${deviceView === "mobile"
                    ? "text-black"
                    : "text-gray-600 hover:text-black"
                    }`}
                  onClick={() => setDeviceView("mobile")}
                />
              </>
            ) : null}

            {previewUrl ? (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-black px-3 py-2 text-xs text-white hover:bg-gray-900 md:text-sm">
                  View
                </Button>
              </a>
            ) : null}
          </div>
        </div>

        <div className="absolute inset-0 flex items-start justify-center bg-white pt-16">
          {waitingForBot ? (
            <UpdatingLobbyOverlay
              visible={waitingForBot}
              statusMessage={projectStatus}
            />
          ) : null}

          {viewMode === "output" ? (
            previewUrl ? (
              <iframe
                key={`${refreshTrigger}-${selectedVersion}-${previewUrl}`}
                src={previewUrl}
                className="border-0"
                style={{
                  width: mobileFrame ? "375px" : "100%",
                  height: mobileFrame ? "667px" : "100%",
                  maxWidth: "100%",
                  borderRadius: mobileFrame ? "16px" : "0",
                  boxShadow: mobileFrame ? "0 0 10px rgba(0,0,0,0.2)" : "none",
                }}
                title="Live Preview"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-6 text-sm text-gray-500">
                Preview URL is not available yet.
              </div>
            )
          ) : null}

          {viewMode === "code" ? (
            <CodeWorkspace
              projectFiles={projectFiles}
              id={id}
              fetchProjectFiles={fetchProjectFiles}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              fileContent={fileContent}
            />
          ) : null}

          {viewMode === "env" ? (
            <div className="h-full w-full p-6 overflow-y-auto">
              {/* <div className="flex h-full items-center justify-center rounded-md border border-dashed border-gray-300 text-sm text-gray-500">
                Environment panel coming soon.
              </div> */}
              <EnvSection project_id={id} />
            </div>
          ) : null}

          {viewMode === "database" ? <>
            <div className="h-full w-full p-6 overflow-y-auto">
              <DatabaseSection project_id={id} />
            </div>
          </> : null}

          {viewMode === "domain" ? <>
            <div className="h-full w-full p-6 overflow-y-auto">
              <DomainSection project_id={id} current_domain={currentDomain} />
            </div>
          </> : null}

          
{viewMode === "settings" ? (
  <div className="h-full w-full p-6 overflow-y-auto">
    <SettingsSection
      project={selectedProject?.data}   // 👈 PASS HERE
    />
  </div>
) : null}
        </div>
      </div>
    );
  };

  const ChatTemp = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { pingDetails } = useAuth();

    const {
      fetchProjectById,
      selectedProject,
      fetchProjectFiles,
      projectFiles,
      fetchProjectFileContent,
      fileContent,
    } = useProjectProvider();

    const [selectedFile, setSelectedFile] = useState("");
    const [input, setInput] = useState("");
    const [viewMode, setViewMode] = useState("output");
    const [waitingForBot, setWaitingForBot] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [deviceView, setDeviceView] = useState("desktop");
    const [selectedVersion, setSelectedVersion] = useState("");
    const [finalMessage, setFinalMessages] = useState([]);
    const [currentDomain, setCurrentDomain] = useState(null);
    const [projectStatus, setProjectStatus] = useState(
      "Working on your update...",
    );
    const [isMobile, setIsMobile] = useState(
      window.innerWidth < MOBILE_BREAKPOINT,
    );
    const [mobileView, setMobileView] = useState("chat");

    const chatContainerRef = useRef(null);
    const chatEndRef = useRef(null);
    const botMessageIndexRef = useRef(null);

    const handleSelectFile = async (filePath) => {
      try {
        setSelectedFile(filePath);
        await fetchProjectFileContent("v1", id, filePath);
      } catch (err) {
        console.error("Fetch project file content error:", err.message);
      }
    };

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      if (!isMobile) {
        setMobileView("chat");
      }
    }, [isMobile]);

    useEffect(() => {
      if (!id) return;

      (async () => {
        const data = await fetchProjectById(id);
        if (!data?.success) return;
        setCurrentDomain(data?.data?.assigned_domain
          ? data.data.assigned_domain.replace(/^https?:\/\//, '')
          : null);

        // await fetchProjectFiles("v1", id);

        setFinalMessages(Array.isArray(data?.data?.chats) ? data.data.chats : []);
        botMessageIndexRef.current = null;

        if (data.data.versions?.length > 0) {
          setSelectedVersion(data.data.versions[data.data.versions.length - 1]);
        }
      })();
    }, [id]);

    useEffect(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, [finalMessage]);

    const updateBotMessage = useCallback(
      (content, type = "string", textType = "normal") => {
        setFinalMessages((prev) => {
          const updated = [...prev];

          if (
            botMessageIndexRef.current !== null &&
            updated[botMessageIndexRef.current]?.sender === "bot"
          ) {
            updated[botMessageIndexRef.current] = {
              sender: "bot",
              message: content,
              type,
              textType,
            };
          } else {
            updated.push({
              sender: "bot",
              message: content,
              type,
              textType,
            });
            botMessageIndexRef.current = updated.length - 1;
          }

          return updated;
        });
      },
      [],
    );

    useEffect(() => {
      if (!id) return;

      if (!socket.connected) {
        socket.connect();
      }

      const onGeneratingUpdateReply = (data) => {
        setWaitingForBot(true);
        setProjectStatus(data?.message || "AI is thinking...");
        updateBotMessage(
          data?.message || "AI is thinking...",
          "string",
          "shimmer",
        );
      };

      const onGeneratedUpdateReply = (data) => {
        const reply =
          data?.data?.reply || data?.message || "AI has generated a response";
        const type = data?.data?.type || "string";

        updateBotMessage(reply, type, "normal");
        setProjectStatus(data?.message || "AI has generated a response");

        if (!data?.success) {
          setWaitingForBot(false);
          botMessageIndexRef.current = null;
          errorToast(data?.message || "Failed to generate response");
        }
      };

      const onFetchingUpdateCode = (data) => {
        setProjectStatus(data?.message || "AI is fetching old code...");
      };

      const onFetchedUpdateCode = (data) => {
        setProjectStatus(data?.message || "AI has fetched old code");
      };

      const onGeneratingUpdateCode = (data) => {
        setProjectStatus(data?.message || "AI is generating updated code...");
      };

      const onGeneratedUpdateCode = (data) => {
        setProjectStatus(data?.message || "AI has generated updated code");
      };

      const onDeploymentUpdateCompleted = (data) => {
        setProjectStatus(data?.message || "Project update deployed successfully");
        setWaitingForBot(false);
        botMessageIndexRef.current = null;

        if (data?.success === false) {
          errorToast(data?.message || "Deployment failed");
          return;
        }

        successToast(data?.message || "Project updated successfully!");
        setRefreshTrigger((prev) => prev + 1);
      };

      const onProjectError = (data) => {
        const message =
          data?.message || "Something went wrong while updating project";
        setProjectStatus(message);
        updateBotMessage(message, "string", "normal");
        setWaitingForBot(false);
        botMessageIndexRef.current = null;
        errorToast(message);
      };

      socket.off("generating:update:reply", onGeneratingUpdateReply);
      socket.off("generated:update:reply", onGeneratedUpdateReply);
      socket.off("fetching:update:code", onFetchingUpdateCode);
      socket.off("fetched:update:code", onFetchedUpdateCode);
      socket.off("generating:update:code", onGeneratingUpdateCode);
      socket.off("generated:update:code", onGeneratedUpdateCode);
      socket.off("deployment:update:completed", onDeploymentUpdateCompleted);
      socket.off("project_error", onProjectError);

      socket.on("generating:update:reply", onGeneratingUpdateReply);
      socket.on("generated:update:reply", onGeneratedUpdateReply);
      socket.on("fetching:update:code", onFetchingUpdateCode);
      socket.on("fetched:update:code", onFetchedUpdateCode);
      socket.on("generating:update:code", onGeneratingUpdateCode);
      socket.on("generated:update:code", onGeneratedUpdateCode);
      socket.on("deployment:update:completed", onDeploymentUpdateCompleted);
      socket.on("project_error", onProjectError);

      return () => {
        socket.off("generating:update:reply", onGeneratingUpdateReply);
        socket.off("generated:update:reply", onGeneratedUpdateReply);
        socket.off("fetching:update:code", onFetchingUpdateCode);
        socket.off("fetched:update:code", onFetchedUpdateCode);
        socket.off("generating:update:code", onGeneratingUpdateCode);
        socket.off("generated:update:code", onGeneratedUpdateCode);
        socket.off("deployment:update:completed", onDeploymentUpdateCompleted);
        socket.off("project_error", onProjectError);
      };
    }, [id, updateBotMessage]);

    const handleSend = () => {
      if (waitingForBot) return;

      const prompt = input.trim();
      if (!prompt) return;
      setViewMode("output");

      const userId =
        pingDetails?.id ||
        selectedProject?.data?.user?.id ||
        selectedProject?.data?.user_id;

      if (!userId) {
        errorToast("Unable to find user details. Please refresh and try again.");
        return;
      }

      if (!id) {
        errorToast("Project not found. Please refresh and try again.");
        return;
      }

      if (!socket.connected) {
        socket.connect();
      }

      setFinalMessages((prev) => {
        const updated = [
          ...prev,
          { sender: "user", message: prompt, type: "string" },
          {
            sender: "bot",
            message: "AI is thinking...",
            type: "string",
            textType: "shimmer",
          },
        ];
        botMessageIndexRef.current = updated.length - 1;
        return updated;
      });

      setInput("");
      setProjectStatus("Queued update request");
      setWaitingForBot(true);

      socket.emit("final_update", {
        prompt,
        user_id: userId,
        project_id: id,
      });
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSend();
      }
    };

    const openMobilePreview = () => {
      setViewMode("output");
      setMobileView("preview");
    };

    const chatPanel = (
      <ChatPanel
        selectedProject={selectedProject}
        waitingForBot={waitingForBot}
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        handleSend={handleSend}
        finalMessage={finalMessage}
        chatContainerRef={chatContainerRef}
        chatEndRef={chatEndRef}
        onNavigateHome={() => navigate("/mainpagescreen")}
        showPreviewButton={isMobile}
        onShowPreview={openMobilePreview}
        setViewMode={setViewMode}
        setMobileView={setMobileView}
      />
    );

    const previewPanel = (
      <PreviewPanel
        isMobile={isMobile}
        onBackToChat={() => setMobileView("chat")}
        viewMode={viewMode}
        setViewMode={setViewMode}
        deviceView={deviceView}
        setDeviceView={setDeviceView}
        refreshTrigger={refreshTrigger}
        setRefreshTrigger={setRefreshTrigger}
        selectedVersion={selectedVersion}
        selectedProject={selectedProject}
        waitingForBot={waitingForBot}
        projectStatus={projectStatus}
        projectFiles={projectFiles}
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        fetchProjectFiles={fetchProjectFiles}
        id={id}
        fileContent={fileContent}
        current_domain={currentDomain}
      />
    );

    return (
      <div className="min-h-screen overflow-hidden bg-white text-gray-900">
        {isMobile ? (
          mobileView === "chat" ? (
            chatPanel
          ) : (
            previewPanel
          )
        ) : (
          <ResizablePanelGroup direction="horizontal" className="h-screen">
            <ResizablePanel defaultSize={32} minSize={24}>
              {chatPanel}
            </ResizablePanel>
            <ResizableHandle className="cursor-col-resize bg-gray-200 hover:bg-gray-400" />
            <ResizablePanel defaultSize={68} minSize={32}>
              {previewPanel}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    );
  };

  export default ChatTemp;
