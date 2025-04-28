import { db } from "../libs/db.js";
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testcases,
      codeSnippets,
      referenceSolutions,
    } = req.body;
  
    // going to check the user role once again
  
    try {
      for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
        const languageId = getJudge0LanguageId(language);
  
        if (!languageId) {
          return res
            .status(400)
            .json({ error: `Language ${language} is not supported` });
        }

        const submissions = testcases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));
  
        const submissionResults = await submitBatch(submissions);
  
        const tokens = submissionResults.map((res) => res.token);
  
        const results = await pollBatchResults(tokens);
  
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          console.log("Result-----", result);
          // console.log(
          //   `Testcase ${i + 1} and Language ${language} ----- result ${JSON.stringify(result.status.description)}`
          // );
          if (result.status.id !== 3) {
            return res.status(400).json({
              error: `Testcase ${i + 1} failed for language ${language}`,
            });
          }
        }
      }
  
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          user: {
            connect: {
              id: req.user.id // Existing user's ID
            }
          }
        },
      });
  
      return res.status(201).json({
        sucess: true,
        message: "Message Created Successfully",
        problem: newProblem,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Error While Creating Problem",
      });
    }
};

export const getAllProblems = async (req, res) => {
    try {
        const problems = await db.problem.findMany();

        if (!problems) {
            return res.status(404).json({
                error: "No problems found"
            })
        }

        res.status(200).json({
            sucess: true,
            message: "Problems fetched successfully",
            problems: problems
        })
    } catch (error) {
        console.error("Error fetching problems ", error)
        return res.status(500).json({
            sucess: false,
            message: "Error fetching problems"
        })
    }
}

export const getProblemByID = async (req, res) => {
    const {id} = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })

        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Problem created successfully",
            problem
        })
    } catch (error) {
        console.error("Error fetching problem by id ", error)
        return res.status(500).json({
            success: false,
            message: "Error fetching problem by id"
        })
    }
}

export const updateProblem = async (req, res) => {

}

export const deleteProblem = async (req, res) => {
    const {id} = req.params;

    try {
        const problem = await db.problem.findUnique({
            where: {
                id
            }
        })
    
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            })
        }
    
        await db.problem.delete({where:{id}})

        return res.status(200).json({
            success: true,
            message: "problem is deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting problem ", error)
        return res.status(500).json({
            success: false,
            message: "Error deleting problem"
        })
    }
}

export const getAllProblemsSolvedByUser = async (req, res) => {

}