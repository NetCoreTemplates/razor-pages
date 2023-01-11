import { $1, bootstrapForm, bindHandlers } from "@servicestack/client"

bootstrapForm($1('form'), {
    success: r => {
        location.href = $1('[name=redirect]').value || '/'
    },
})

bindHandlers({
    switchUser: u => {
        $1("[name=userName]").value = u
        $1("[name=password]").value = 'p@55wOrd'
    },
})
