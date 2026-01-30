
import { useState } from "react";
import { AddIcon } from "../../components/icons/Icon";
import { useVentItems } from "../../hooks/useVentItems";

export function Braindump() {

    const { ventItems, create, remove } = useVentItems();
    const [itemTitle, setItemTitle] = useState("");

    return (<>

        <center>
            <h2>Braindump</h2>
            <span>Personal Venting Session</span>
        </center>
        <div style={{ maxWidth: "600px", margin: "auto", display: "block" }}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    const result = await create(itemTitle);

                    if (!result.ok) {
                        alert(result.error);
                        return;
                    }

                    setItemTitle("");
                }}

            >
                <input type="text"
                    onChange={(e) => setItemTitle(e.target.value)}
                ></input>
                <button type="submit">Add</button>
            </form>

            <AddIcon />
            <ul>
                {ventItems.map((i) => (
                    <>
                        <li key={i.id} data-id={i.id} >{i.title}</li>
                        <button
                            onClick={async () => {
                                const result = await remove(i.id);
                                if (!result.ok) {
                                    alert(result.error);
                                    return;
                                }
                            }


                            }
                        >
                            X
                        </button>
                    </>
                ))}
            </ul>
        </div>


    </>)
}