import { Resume } from "@/lib/resumeParsing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const ResumeDisplay = ({ extractedData }: { extractedData: Resume }) => {
  console.log(extractedData);
  return (
    <div className="p-6 space-y-4">
      {/* Personal Information Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <CardDescription>
              <strong>Name:</strong> {extractedData.fullName}
            </CardDescription>
            <CardDescription>
              <strong>Email:</strong> {extractedData.email}
            </CardDescription>
            {extractedData.phone && (
              <CardDescription>
                <strong>Phone:</strong> {extractedData.phone}
              </CardDescription>
            )}
            {extractedData.linkedIn && (
              <div>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={extractedData.linkedIn}
                  target="_blank"
                  className="div-blue-500"
                >
                  {extractedData.linkedIn}
                </a>
              </div>
            )}
            {extractedData.portfolio && (
              <div>
                <strong>Portfolio:</strong>{" "}
                <a
                  href={extractedData.portfolio}
                  target="_blank"
                  className="div-blue-500"
                >
                  {extractedData.portfolio}
                </a>
              </div>
            )}
            <div>
              <strong>Job CardTitle:</strong> {extractedData.jobTitle}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{extractedData.summary}</div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      {
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="div-xl font-semibold">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{extractedData.skills}</p>
          </CardContent>
        </Card>
      }

      {/* Experience Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">Experience</CardTitle>
        </CardHeader>
        <CardContent>
          {extractedData.experience.map((job, index) => (
            <div key={index} className="space-y-2">
              <div>
                <strong>
                  {job.jobTitle} at {job.companyName}
                </strong>
              </div>
              <div>
                <em>
                  {job.startDate} - {job.endDate || "Present"}
                </em>
              </div>
              {job.responsibilities && (
                <ul className="list-disc pl-5 space-y-1">
                  {job.responsibilities.map((responsibility, idx) => (
                    <li key={idx}>
                      <div>{responsibility}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="bg-white shadow-md rounded-md">
        <CardHeader>
          <CardTitle className="div-xl font-semibold">Education</CardTitle>
        </CardHeader>
        <CardContent>
          {extractedData.education.map((edu, index) => (
            <div key={index} className="space-y-2">
              <div>
                <strong>{edu.degree}</strong> from {edu.institution}
              </div>
              {edu.yearsAttended && (
                <div>
                  <em>{edu.yearsAttended}</em>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications Section */}
      {extractedData.certifications &&
        extractedData.certifications.length > 0 && (
          <Card className="bg-white shadow-md rounded-md">
            <CardHeader>
              <CardTitle className="div-xl font-semibold">
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {extractedData.certifications.map((cert, index) => (
                <div key={index} className="space-y-2">
                  <div>
                    <strong>{cert.name}</strong>
                    {cert.organization && ` by ${cert.organization}`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

      {/* Projects Section */}
      {extractedData.projects && extractedData.projects.length > 0 && (
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="div-xl font-semibold">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {extractedData.projects.map((project, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <strong>{project.title}</strong>
                </div>
                {project.description && <div>{project.description}</div>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Additional Sections: Awards, Languages, etc. */}
      {extractedData.awards && extractedData.awards.length > 0 && (
        <Card className="bg-white shadow-md rounded-md">
          <CardHeader>
            <CardTitle className="div-xl font-semibold">Awards</CardTitle>
          </CardHeader>
          <CardContent>
            {extractedData.awards.map((award, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <strong>{award.title}</strong>
                  {award.issuer && ` by ${award.issuer}`}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeDisplay;
