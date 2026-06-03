// import React, { useRef, useLayoutEffect } from "react"
// import { Plus, Mic, ArrowUp } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const ChatInput = ({ value, onChange, onSend }) => {
//     const textareaRef = useRef(null)

//     const resizeTextarea = () => {
//         const el = textareaRef.current
//         if (!el) return

//         el.style.height = "auto"
//         const maxHeight = 180
//         el.style.height = Math.min(el.scrollHeight, maxHeight) + "px"
//     }

//     useLayoutEffect(() => {
//         resizeTextarea()
//     }, [value])

//     return (
//         <div className="w-full px-2 sm:px-4 md:px-6 pb-3 sm:pb-4">
//             <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
//                 <div
//                     className="
//             flex items-end gap-1 sm:gap-2
//             bg-white
//             border border-gray-300
//             rounded-xl sm:rounded-2xl
//             shadow-sm
//             px-2 sm:px-3
//             py-1.5 sm:py-2
//             w-full
//             overflow-hidden   /* 🔥 IMPORTANT */
//           "
//                 >
//                     {/* PLUS */}
//                     <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="icon"
//                                 className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full"
//                             >
//                                 <Plus className="w-4 h-4 text-gray-600" />
//                             </Button>
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent align="start" className="w-52 rounded-xl">
//                             <DropdownMenuItem>Add photos & files</DropdownMenuItem>
//                             <DropdownMenuItem>Deep research</DropdownMenuItem>
//                             <DropdownMenuItem>Shopping research</DropdownMenuItem>
//                             <DropdownMenuItem>Create image</DropdownMenuItem>
//                             <DropdownMenuItem>Agent mode</DropdownMenuItem>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//                     {/* TEXTAREA */}
//                     <Textarea
//                         ref={textareaRef}
//                         value={value}
//                         placeholder="Ask anything..."
//                         rows={1}
//                         onChange={onChange}
//                         onInput={resizeTextarea}
//                         onKeyDown={(e) => {
//                             if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault()
//                                 onSend()
//                             }
//                         }}
//                         className="
//               flex-1
//               min-w-0
//               w-0              /* 🔥 VERY IMPORTANT */
//               resize-none
//               border-none
//               bg-transparent
//               focus-visible:ring-0
//               focus:outline-none
//               text-sm sm:text-base
//               text-gray-800
//               placeholder:text-gray-400
//               leading-relaxed
//               min-h-[40px]
//               max-h-[180px]
//               overflow-y-auto
//               overflow-x-hidden
//               break-all        /* 🔥 Fix long text */
//               box-border
//             "
//                     />

//                     {/* MIC */}
//                     <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full"
//                     >
//                         <Mic className="w-4 h-4 text-gray-600" />
//                     </Button>

//                     {/* SEND */}
//                     <Button
//                         type="button"
//                         onClick={onSend}
//                         disabled={!value.trim()}
//                         className="
//               shrink-0
//               rounded-full
//               bg-black
//               hover:bg-gray-900
//               disabled:opacity-40
//               text-white
//               h-8 w-8 sm:h-9 sm:w-9
//               p-0
//             "
//                     >
//                         <ArrowUp className="w-4 h-4" />
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatInput



import React, { useRef, useLayoutEffect } from "react";
import { Plus, Mic, ArrowUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { errorToast } from "./Toast.Atom";

const ChatInput = ({
    value,
    onChange,
    onSend,
    links,
    setLinks,
}) => {
    const textareaRef = useRef(null);

    const resizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";

        const maxHeight = 180;
        el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    };

    useLayoutEffect(() => {
        resizeTextarea();
    }, [value]);

    const extractUrls = (text) => {
        const regex = /(https?:\/\/[^\s]+)/g;
        return text.match(regex) || [];
    };

    const handleInputChange = (e) => {
        onChange(e);
    };



    const handleEnter = (e) => {
        if (e.key !== "Enter" || e.shiftKey) return;

        const urls = extractUrls(value);

        console.log("Detected URLs:", urls);

        if (urls.length > 0) {
            e.preventDefault();

            setLinks((prev) => {
                const updatedLinks = [...new Set([...prev, ...urls])];

                if (updatedLinks.length > 3) {
                    errorToast("Maximum 3 links allowed");
                    return prev;
                }

                return updatedLinks;
            });

            return;
        }

        e.preventDefault();
        onSend();
    };
    return (
        <div className="w-full px-2 sm:px-4 md:px-6 pb-3 sm:pb-4">
            <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">
                <div
                    className="
            bg-white
            border border-gray-300
            rounded-xl sm:rounded-2xl
            shadow-sm
            px-2 sm:px-3
            py-2
            w-full
          "
                >
                    {/* URL Chips */}
                    {links?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 w-full 
">
                            {links.map((link, index) => (
                                <div
                                    key={index}
                                    className="  flex-shrink-0
  flex items-center
  gap-2
  px-2 sm:px-3
  py-1
  bg-gray-100
  border
  rounded-full
  text-xs sm:text-sm" >
                             <span className="     max-w-[80px]
    sm:max-w-[180px]
    md:max-w-[220px]
    truncate">
                                        {link}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLinks((prev) =>
                                                prev.filter((_, i) => i !== index)
                                            )
                                        }
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2 w-full">
                        {/* PLUS */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                                >
                                    <Plus className="w-4 h-4 text-gray-600" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="start"
                                className="w-52 rounded-xl"
                            >
                                <DropdownMenuItem>
                                    Add photos & files
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Deep research
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Shopping research
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Create image
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                    Agent mode
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* TEXTAREA */}
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            placeholder="Ask anything..."
                            rows={1}
                            onChange={handleInputChange}
                            onInput={resizeTextarea}
                            onKeyDown={handleEnter}
                            className="
                flex-1
                min-w-0
                w-0
                resize-none
                border-none
                bg-transparent
                focus-visible:ring-0
                focus:outline-none
                text-sm sm:text-base
                text-gray-800
                placeholder:text-gray-400
                leading-relaxed
                min-h-[40px]
                max-h-[180px]
                overflow-y-auto scrollbar-hide
                overflow-x-hidden
                break-all
                box-border
              "       
                        />

                        {/* MIC */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                        >
                            <Mic className="w-4 h-4 text-gray-600" />
                        </Button>

                        {/* SEND */}
                        <Button
                            type="button"
                            onClick={onSend}
                            disabled={!value.trim()}
                            className="
                shrink-0
                rounded-full
                bg-black
                hover:bg-gray-900
                disabled:opacity-40
                text-white
                h-8 w-8 sm:h-9 sm:w-9
                p-0
              "
                        >
                            <ArrowUp className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;








