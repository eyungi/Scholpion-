from rest_framework_nested import routers
from .views import ExamView, ProbView, SolvedExamView, CommentView, RecommendedExamView, FeedBackViewSet

router = routers.DefaultRouter()

# exams/
router.register(r'recommended-exams', RecommendedExamView, basename='recommended-exams')
router.register(r'exams', ExamView, basename='exams')
# exams/<str:pk>/problems/
exam_router = routers.NestedDefaultRouter(router, r'exams', lookup='exam')
exam_router.register(r'problems', ProbView, basename='exam-problems')
# solved-exams/
router.register(r'solved-exams', SolvedExamView)
router.register('feedbacks', FeedBackViewSet, basename='feedbacks')
# solved-exams/<str:pk>/comments/
solved_exam_router = routers.NestedDefaultRouter(router, r'solved-exams', lookup='solved_exam')
solved_exam_router.register(r'comments', CommentView, basename='solved-exam-comments')

# urlpatterns에 두 라우터를 합침
urlpatterns = router.urls + exam_router.urls + solved_exam_router.urls