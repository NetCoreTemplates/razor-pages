import { $1, bootstrapForm, bindHandlers, splitOnFirst, toPascalCase } from "@servicestack/client"

bootstrapForm($1('form'), {
    success: r => {
        location.href = $1('[name=continue]').value || '/'
    },
})

bindHandlers({
    newUser: function(u) {
        const names = u.split('@')
        $1("[name=displayName]").value = toPascalCase(names[0]) + " " + toPascalCase(splitOnFirst(names[1],'.')[0])
        $1("[name=email]").value = u
        $1("[name=password]").value = $1("[name=confirmPassword]").value = 'p@55wOrd'
    },
})
