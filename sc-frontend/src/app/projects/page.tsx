import PageHeader from "@/components/PageHeader";
import Card from "@/components/Card";
import { Project } from "@/types";

// TODO: 后端对接后替换为 API 调用
const mockProjects: Project[] = [
  {
    id: "1",
    title: "SuperCenter",
    description: "个人网站项目",
    status: "ACTIVE",
    coverUrl: "/images/project_1.jpg",
    linkUrl: "https://github.com",
  },
  {
    id: "2",
    title: "AI Tool",
    description: "AI 工具集",
    status: "PLANNING",
    coverUrl: "/images/project_2.jpg",
    linkUrl: "https://github.com",
  },
  {
    id: "3",
    title: "Data Pipeline",
    description: "数据处理流水线",
    status: "COMPLETED",
    coverUrl: "/images/project_3.jpg",
    linkUrl: "https://github.com",
  },
];

export default function Projects() {
  const projects = mockProjects;

  return (
    <>
      <PageHeader
        title="Projects."
        description="What I'm working on. Feel free to reach out if you're interested in collaborating!"
      />
      <div className="grid grid-cols-1 sm:grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.id} {...project} />
        ))}
      </div>
    </>
  );
}
