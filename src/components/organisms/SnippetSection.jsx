import React, {
    useEffect,
    useState,
} from "react";

import { useProjectProvider } from "@/hooks/useProjectProvider";


const SnippetSection = ({ project_id }) => {

    const [loading, setLoading] = useState(false);

    const [openModal, setOpenModal] =
        useState(false);

    const [selectedRows, setSelectedRows] =
        useState([]);

    const [openDialog, setOpenDialog] =
        useState(false);

    const [selectedSnippet, setSelectedSnippet] =
        useState(null);

    const [name, setName] = useState("");

    const [type, setType] = useState("Head");

    const [content, setContent] =
        useState("");


    const [insertBottom, setInsertBottom] = useState(false);

    const {
        snippets,
        fetchSnippets,
        createSnippet,
    } = useProjectProvider();



    useEffect(() => {
        if (project_id) {
            fetchSnippets(project_id);
        }
    }, [project_id]);





    const handleCreateSnippet = async () => {
        try {
            setLoading(true);

            const payload = {
                name,
                content,
                location: type,
                insertBottom: insertBottom,
            };

            await createSnippet(project_id, payload);
            await fetchSnippets(project_id);

            setOpenModal(false);

            setName("");
            setType("Head");
            setContent("");
            setInsertBottom(false);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const handleSelect = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(
                selectedRows.filter(
                    (item) => item !== id
                )
            );
        } else {
            setSelectedRows([
                ...selectedRows,
                id,
            ]);
        }
    };

    const handleOpenDialog = (item) => {
        setSelectedSnippet(item);

        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);

        setSelectedSnippet(null);
    };


    const decodeBase64 = (str) => {
        try {
            return decodeURIComponent(
                escape(atob(str))
            );
        } catch (e) {
            return "";
        }
    };



    return (
        <div className="w-full min-h-screen p-3 sm:p-5 md:p-6">


            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-black">
                        Snippet Variables
                    </h2>

                    <p className="text-xs text-gray-500">
                        View and manage your
                        application Snippet variables
                    </p>
                </div>

                <button
                    onClick={() =>
                        setOpenModal(true)
                    }
                    className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-[#111] transition-all"
                >
                    + Add Snippet
                </button>
            </div>



            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">


                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-semibold text-black">
                                Add Snippet
                            </h2>

                            <button
                                onClick={() =>
                                    setOpenModal(false)
                                }
                                className="text-xl text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>



                        <div className="p-6 space-y-5">


                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter snippet name"
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                                />
                            </div>



                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Type
                                </label>

                                <select
                                    value={type}
                                    onChange={(e) =>
                                        setType(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                                >
                                    <option>
                                        Head
                                    </option>

                                    <option>
                                        Body
                                    </option>
                                </select>
                            </div>



                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Insert Bottom
                                </label>

                                <select
                                    value={insertBottom}
                                    onChange={(e) =>
                                        setInsertBottom(e.target.value === "true")
                                    }
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                                >
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>



                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Content
                                </label>

                                <textarea
                                    rows={5}
                                    value={content}
                                    onChange={(e) =>
                                        setContent(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter snippet code"
                                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
                                />
                            </div>
                        </div>


                        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                            <button
                                onClick={() =>
                                    setOpenModal(false)
                                }
                                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
                            >
                                Cancel
                            </button>



                            <button
                                onClick={handleCreateSnippet}
                                disabled={loading}
                                className={`rounded-xl px-5 py-2 text-sm font-medium text-white transition-all 
                                            ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-[#111]"}`}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

          

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              

                <div className="grid grid-cols-[80px_1fr_1fr_auto] items-center border-b border-gray-200 bg-[#fafafa] px-4 py-5">
                    <div>
                        <input
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                        />
                    </div>

                    <div className="text-sm font-semibold text-gray-800">
                        Name
                    </div>

                    <div className="text-sm font-semibold text-gray-800">
                        Type
                    </div>

                    <div className="text-right pr-10 text-sm font-semibold text-gray-800">
                        Action
                    </div>
                </div>

               

                {snippets?.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[80px_1fr_1fr_auto] items-center border-b border-gray-100 px-4 py-5 hover:bg-gray-50 transition-all"
                    >
                        <div>
                            <input
                                type="checkbox"
                                checked={selectedRows.includes(
                                    item.id
                                )}
                                onChange={() =>
                                    handleSelect(item.id)
                                }
                                className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                            />
                        </div>

                        <div>
                            <p className="text-[#2563eb] text-base font-medium">
                                {item.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-base text-gray-700">
                                {item.location}
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() =>
                                    handleOpenDialog(
                                        item
                                    )
                                }
                                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#111]"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

           

            {openDialog && (
                <div className="fixed inset-0 z-50">
                    <div
                        onClick={handleCloseDialog}
                        className="absolute inset-0 bg-black/40"
                    />

                    <div className="absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                            <h2 className="text-xl font-semibold text-black">
                                Snippet Details
                            </h2>

                            <button
                                onClick={
                                    handleCloseDialog
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-black">
                                {
                                    selectedSnippet?.name
                                }
                            </h3>



                            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                {decodeBase64(selectedSnippet?.content || "")}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SnippetSection;