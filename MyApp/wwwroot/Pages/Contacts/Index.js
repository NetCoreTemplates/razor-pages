import { $1, bootstrapForm } from "@servicestack/client"
import { client } from "../../js/default.mjs"
import { Contact, GetContacts, DeleteContact } from "../../js/dtos.mjs"
import { createApp, reactive, ref, computed } from "vue"

/** @typedef CONTACTS - declared in Contacts/Index.cshtml */
let contacts = window.CONTACTS

/** @type {{contacts:Contact[]}} */
let AppData = reactive({ contacts })

bootstrapForm($1("form"), {
    success: function (r) {
        $1("form").reset()
        AppData.contacts.push(r.result)
    },
})

createApp({
    template:$1('#results-template'),
    setup(props) {
        let contacts = computed(() => AppData.contacts)

        const deleteContact = async ({ id }) => {
            if (!confirm('Are you sure?'))
                return;
            await client.apiVoid(new DeleteContact({ id }))
            let api = await client.api(new GetContacts())
            if (api.succeeded) {
                AppData.contacts = api.response.results
            }
        }
        return {
            contacts,
            deleteContact,
        }
    },
}).mount('#results')