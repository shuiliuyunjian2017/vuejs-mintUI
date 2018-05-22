import listArticlecourse from './listArticlecourse'
import detailArticlecourse from './detailArticlecourse'

export default [
    {path : '/listArticlecourse', name : 'listArticlecourse', component : listArticlecourse},
    {path : '/detailArticlecourse/:courseId', name : 'detailArticlecourse', component : detailArticlecourse},
]
