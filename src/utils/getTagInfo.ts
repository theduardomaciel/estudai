export const tagsNames = ['Questions List', 'Theoretical Material', 'Slides', 'Summaries', 'Reolutions']
const tagsIcons = ['print', 'description', 'co_present', 'history_edu', 'wallpaper']

export const getTagInfo = (id: number) => {
    return [tagsNames[id], tagsIcons[id]]
}