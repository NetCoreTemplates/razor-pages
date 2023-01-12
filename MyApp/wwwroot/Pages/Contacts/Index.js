import { $1, bootstrapForm } from "@servicestack/client"
import { client } from "../../js/default.mjs"
import { GetContacts, DeleteContact } from "../../js/dtos.mjs"
import { createApp, reactive, ref, computed } from "vue"

let contacts = window.CONTACTS //defined in Contacts/Index.chtml

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

        const deleteContact = ({ id }) => {
            if (!confirm('Are you sure?'))
                return;
            client.apiVoid(new DeleteContact({ id })).then(_ =>
                client.api(new GetContacts()).then(api => {
                    if (api.succeeded) {
                        AppData.contacts = api.response.results
                    }
                }))
        }
        return {
            contacts,
            deleteContact,
        }
    },
}).mount('#results')