export const tagsNames = ['Lista de Questões', 'Material Teórico', 'Slides', 'Resumos', 'Resoluções']
const tagsIcons = ['print', 'description', 'co_present', 'history_edu', 'wallpaper']

export const getTagInfo = (id: number) => {
    return [tagsNames[id], tagsIcons[id]]
}