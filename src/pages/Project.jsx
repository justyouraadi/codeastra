import React from "react";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ArrowLeft,
  Eye,
  Send,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ContextProvider";
import { socket } from "@/socket/socket";
import { errorToast, successToast } from "@/components/atoms/Toast.Atom";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import UpdatingLobbyOverlay from "@/utils/UpdatingLobbyOverlay";

export default function Project() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pingDetails } = useAuth();
  const isInitialPromptFlow = Boolean(location?.state?.initialPrompt);

  const [waitingForBot, setWaitingForBot] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [timeline, setTimeline] = React.useState([]);
  const [projectStatus, setProjectStatus] = React.useState("Idle");
  const [currentPipelineStage, setCurrentPipelineStage] = React.useState("");
  const [projectName, setProjectName] = React.useState("");
  const [projectDescription, setProjectDescription] = React.useState("");
  const [databaseName, setDatabaseName] = React.useState("");
  const [repoUrl, setRepoUrl] = React.useState("");
  const [deploymentUrl, setDeploymentUrl] = React.useState("");

  const botMessageIndexRef = React.useRef(null);
  const autoRequestedRef = React.useRef(false);
  const chatEndRef = React.useRef(null);

  const normalizedDeploymentUrl = React.useMemo(() => {
    if (!deploymentUrl) return "";
    if (/^https?:\/\//i.test(deploymentUrl)) return deploymentUrl;
    return `https://${deploymentUrl}`;
  }, [deploymentUrl]);

  const addTimelineEntry = React.useCallback((stage, message, payload = {}) => {
    setTimeline((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        stage,
        message,
        payload,
        createdAt: new Date().toISOString(),
      },
    ]);
    setProjectStatus(message || stage);
    setCurrentPipelineStage(stage || "");
  }, []);

  const updateBotMessage = React.useCallback((content, type = "string") => {
    setMessages((prev) => {
      const updated = [...prev];
      if (
        botMessageIndexRef.current !== null &&
        updated[botMessageIndexRef.current]
      ) {
        updated[botMessageIndexRef.current] = {
          sender: "bot",
          message: content,
          type,
          textType: "normal",
        };
      } else {
        updated.push({
          sender: "bot",
          message: content,
          type,
          textType: "normal",
        });
        botMessageIndexRef.current = updated.length - 1;
      }
      return updated;
    });
  }, []);

  const startFinalGeneration = React.useCallback(
    (rawPrompt) => {
      const prompt = rawPrompt.trim();
      if (!prompt) {
        errorToast("Please enter something first!");
        return false;
      }

      const words = prompt.split(/\s+/).filter(Boolean);
      if (words.length < 5) {
        errorToast("Prompt is too small!");
        return false;
      }

      if (words.length > 800) {
        errorToast("Prompt is too long!");
        return false;
      }

      if (!pingDetails?.id) {
        errorToast("Unable to find user details. Please refresh and try again.");
        return false;
      }

      if (!socket.connected) {
        socket.connect();
      }

      setWaitingForBot(true);
      setProjectName("");
      setProjectDescription("");
      setDatabaseName("");
      setRepoUrl("");
      setDeploymentUrl("");
      setTimeline([]);
      setCurrentPipelineStage("");

      setMessages((prev) => {
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

      addTimelineEntry("generating:reply", "Queued request for generation");
      socket.emit("final", {
        prompt,
        user_id: pingDetails.id,
      });

      return true;
    },
    [addTimelineEntry, pingDetails?.id],
  );

  function handleSend() {
    if (waitingForBot) return;
    const hasStarted = startFinalGeneration(input);
    if (hasStarted) {
      setInput("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  React.useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onGeneratingReply = (data) => {
      addTimelineEntry("generating:reply", data?.message || "Generating reply...");
    };

    const onGeneratedReply = (data) => {
      const reply = data?.data?.reply || "No reply generated";
      const type = data?.data?.type || "string";

      updateBotMessage(reply, type);
      addTimelineEntry("generated:reply", data?.message || "Reply generated", data?.data || {});

      if (!data?.success) {
        errorToast("Failed to generate reply");
      }
    };

    const onGeneratingMeta = (data) => {
      addTimelineEntry("generating:meta", data?.message || "Generating metadata...");
    };

    const onGeneratedMeta = (data) => {
      const name = data?.data?.name || "";
      const description = data?.data?.description || "";
      setProjectName(name);
      setProjectDescription(description);
      addTimelineEntry("generated:meta", data?.message || "Metadata generated", data?.data || {});
    };

    const onGeneratingDatabase = (data) => {
      addTimelineEntry(
        "generating:database",
        data?.message || "Creating database...",
      );
    };

    const onGeneratedDatabase = (data) => {
      setDatabaseName(data?.data?.database || "");
      addTimelineEntry(
        "generated:database",
        data?.message || "Database created",
        data?.data || {},
      );
    };

    const onGeneratingGithub = (data) => {
      addTimelineEntry("generating:github", data?.message || "Creating repository...");
    };

    const onGeneratedGithub = (data) => {
      const generatedUrl = data?.data?.repoUrl || "";
      if (generatedUrl) setRepoUrl(generatedUrl);
      addTimelineEntry(
        "generated:github",
        data?.message || "Repository generated",
        data?.data || {},
      );
    };

    const onGeneratingFiles = (data) => {
      addTimelineEntry("generating:files", data?.message || "Generating files...");
    };

    const onGeneratedFiles = (data) => {
      if (typeof data?.data === "string" && data.data.startsWith("http")) {
        setRepoUrl(data.data);
      }
      addTimelineEntry("generated:files", data?.message || "Files generated", data?.data || {});
    };

    const onDeploymentStarted = (data) => {
      addTimelineEntry("deployment:started", data?.message || "Deployment started");
    };

    const onDeploymentProvisioned = (data) => {
      addTimelineEntry(
        "deployment:provisioned",
        data?.message || "Deployment provisioned",
      );
    };

    const onDeploymentConfiguring = (data) => {
      addTimelineEntry(
        "deployment:configuring",
        data?.message || "Deployment configuring",
      );
    };

    const onDeploymentConfigured = (data) => {
      const siteUrl = data?.data?.siteUrl || "";
      if (siteUrl) setDeploymentUrl(siteUrl);
      addTimelineEntry(
        "deployment:configured",
        data?.message || "Deployment configured",
        data?.data || {},
      );
      setWaitingForBot(false);
      successToast("Project created successfully!");
      navigate(`/chatpage/${data?.data?.project_id}`,{replace:true});
    };

    const onProjectError = (data) => {
      setWaitingForBot(false);
      const message = data?.message || "Something went wrong while creating project";
      addTimelineEntry("project:error", message, data || {});
      updateBotMessage(message, "string");
      errorToast(message);
    };

    socket.off("generating:reply", onGeneratingReply);
    socket.off("generated:reply", onGeneratedReply);
    socket.off("generating:meta", onGeneratingMeta);
    socket.off("generated:meta", onGeneratedMeta);
    socket.off("generating:database", onGeneratingDatabase);
    socket.off("generated:database", onGeneratedDatabase);
    socket.off("generating:github", onGeneratingGithub);
    socket.off("generated:github", onGeneratedGithub);
    socket.off("generating:files", onGeneratingFiles);
    socket.off("generated:files", onGeneratedFiles);
    socket.off("deployment:started", onDeploymentStarted);
    socket.off("deployment:provisioned", onDeploymentProvisioned);
    socket.off("deployment:configuring", onDeploymentConfiguring);
    socket.off("deployment:configured", onDeploymentConfigured);
    socket.off("project_error", onProjectError);

    socket.on("generating:reply", onGeneratingReply);
    socket.on("generated:reply", onGeneratedReply);
    socket.on("generating:meta", onGeneratingMeta);
    socket.on("generated:meta", onGeneratedMeta);
    socket.on("generating:database", onGeneratingDatabase);
    socket.on("generated:database", onGeneratedDatabase);
    socket.on("generating:github", onGeneratingGithub);
    socket.on("generated:github", onGeneratedGithub);
    socket.on("generating:files", onGeneratingFiles);
    socket.on("generated:files", onGeneratedFiles);
    socket.on("deployment:started", onDeploymentStarted);
    socket.on("deployment:provisioned", onDeploymentProvisioned);
    socket.on("deployment:configuring", onDeploymentConfiguring);
    socket.on("deployment:configured", onDeploymentConfigured);
    socket.on("project_error", onProjectError);

    return () => {
      socket.off("generating:reply", onGeneratingReply);
      socket.off("generated:reply", onGeneratedReply);
      socket.off("generating:meta", onGeneratingMeta);
      socket.off("generated:meta", onGeneratedMeta);
      socket.off("generating:database", onGeneratingDatabase);
      socket.off("generated:database", onGeneratedDatabase);
      socket.off("generating:github", onGeneratingGithub);
      socket.off("generated:github", onGeneratedGithub);
      socket.off("generating:files", onGeneratingFiles);
      socket.off("generated:files", onGeneratedFiles);
      socket.off("deployment:started", onDeploymentStarted);
      socket.off("deployment:provisioned", onDeploymentProvisioned);
      socket.off("deployment:configuring", onDeploymentConfiguring);
      socket.off("deployment:configured", onDeploymentConfigured);
      socket.off("project_error", onProjectError);
    };
  }, [addTimelineEntry, updateBotMessage]);

  React.useEffect(() => {
    const initialPrompt = location?.state?.initialPrompt;

    if (!initialPrompt || autoRequestedRef.current || !pingDetails?.id) {
      return;
    }

    autoRequestedRef.current = true;
    startFinalGeneration(initialPrompt);
  }, [location?.state?.initialPrompt, pingDetails?.id, startFinalGeneration]);

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full min-h-screen overflow-hidden"
      >
        <ResizablePanel defaultSize={isInitialPromptFlow ? 40 : 100}>
          <div className="flex flex-col h-full overflow-hidden">
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
                  {projectName || "Project Chat"}
                </h1>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 md:hidden"
                >
                  <Eye className="w-4 h-4" /> Preview
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center text-sm text-gray-500">
                  <div className="text-center max-w-sm">
                    <p className="font-medium text-gray-700">No conversation yet</p>
                    <p className="mt-1">
                      Send a prompt to start final project generation and deployment.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div key={`${index}-${message.sender}`}>
                  {message.sender === "bot" ? (
                    <div className="flex items-start gap-2 justify-start">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                          CA
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">CodeAstra</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg text-sm shadow max-w-[80%] ${
                          message?.textType === "shimmer"
                            ? "bg-gray-50 text-gray-600 animate-pulse"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message?.type === "string" ? (
                          message?.message
                        ) : (
                          <MarkdownRenderer>{message?.message || ""}</MarkdownRenderer>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 justify-end">
                      <div className="p-3 rounded-lg text-sm shadow max-w-[80%] bg-black text-white">
                        {message?.message}
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                          U
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">
                          {pingDetails?.name || "You"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div ref={chatEndRef} />
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
                disabled={waitingForBot || !input.trim()}
                className={`${
                  waitingForBot ? "bg-gray-400" : "bg-black hover:bg-gray-900"
                } text-white`}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </ResizablePanel>
        {isInitialPromptFlow && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60}>
              <div className="relative flex h-full flex-col overflow-hidden">
                {waitingForBot && (
                  <UpdatingLobbyOverlay
                    visible={waitingForBot}
                    statusMessage={projectStatus || "Working on your project..."}
                    pipelineStage={currentPipelineStage}
                  />
                )}



                <div className="flex-1 bg-white">
                  {normalizedDeploymentUrl ? (
                    <iframe
                      src={normalizedDeploymentUrl}
                      className="w-full h-full border-0"
                      title="Live Preview"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-gray-500 px-4 text-center">
                      Preview will appear here after deployment is configured.
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </>
  );
}
