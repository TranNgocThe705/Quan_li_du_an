import { Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import StatsGrid from '../../components/features/dashboard/StatsGrid'
import ProjectOverview from '../../components/features/projects/ProjectOverview'
import RecentActivity from '../../components/features/dashboard/RecentActivity'
import TasksSummary from '../../components/features/tasks/TasksSummary'
import CreateProjectDialog from '../../components/features/projects/CreateProjectDialog'
import { fetchWorkspaces } from '../../features/workspaceSlice'
import { fetchProjects } from '../../features/projectSlice'
import { fetchMyTasks } from '../../features/taskSlice'

const Dashboard = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector(state => state.auth);
    const { currentWorkspace, loading: workspaceLoading } = useSelector(state => state.workspace);
    const { loading: projectLoading } = useSelector(state => state.project);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Fetch all data on component mount only
        const fetchData = async () => {
            try {
                const workspacesResult = await dispatch(fetchWorkspaces()).unwrap();
                
                // Get workspace ID from localStorage or first workspace
                const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
                const workspaceId = savedWorkspaceId || workspacesResult[0]?._id;
                
                if (workspaceId) {
                    dispatch(fetchProjects(workspaceId));
                    dispatch(fetchMyTasks());
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency - only run once on mount

    const isLoading = workspaceLoading || projectLoading;

    return (
        <div className='max-w-6xl mx-auto'>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1"> 
                        {t('dashboard.greeting')}, {user?.name || 'User'} 
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm"> 
                        {t('dashboard.subtitle')} 
                    </p>
                </div>

                <button 
                    onClick={() => setIsDialogOpen(true)} 
                    disabled={!currentWorkspace || isLoading}
                    className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white space-x-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                >
                    <Plus size={16} /> {t('dashboard.newProject')}
                </button>

                <CreateProjectDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            </div>

            <StatsGrid />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProjectOverview />
                    <RecentActivity />
                </div>
                <div>
                    <TasksSummary />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
