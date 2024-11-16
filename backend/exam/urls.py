from rest_framework_nested import routers
from .views import ExamView, ProbView

router = routers.DefaultRouter()

# exams/
router.register(r'exams', ExamView)
# exams/<str:pk>/problems/
exam_router = routers.NestedDefaultRouter(router, r'exams', lookup='exam')
exam_router.register(r'problems', ProbView, basename='exam-problems')

# urlpatterns에 두 라우터를 합침
urlpatterns = router.urls + exam_router.urls