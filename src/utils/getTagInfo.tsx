export const tagsNames = ['Lista de Questões', 'Material Teórico', 'Slides', 'Resumos', 'Imagens']
const tagsIcons = ['print', 'description', 'media_link', 'history_edu', 'wallpaper']

export const getTagInfo = (id: number) => {
    return [tagsNames[id], tagsIcons[id]]
}