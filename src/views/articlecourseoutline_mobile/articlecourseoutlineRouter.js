import listArticlecourseoutline from './listArticlecourseoutline'
import detailArticlecourseoutline from './detailArticlecourseoutline'

export default [
    {path : '/listArticlecourseoutline', name : 'listArticlecourseoutline', component : listArticlecourseoutline},
    {path : '/detailArticlecourseoutline/:outlineId', name : 'detailArticlecourseoutline', component : detailArticlecourseoutline},
]
